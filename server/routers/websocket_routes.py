import json
from typing import List, Dict, Set
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

router = APIRouter(tags=["Live Queue WebSocket"])

class QueueConnectionManager:
    def __init__(self):
        # Room -> Set of active WebSockets
        self.rooms: Dict[str, Set[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, room: str = "general"):
        await websocket.accept()
        if room not in self.rooms:
            self.rooms[room] = set()
        self.rooms[room].add(websocket)

    def disconnect(self, websocket: WebSocket, room: str = "general"):
        if room in self.rooms:
            self.rooms[room].discard(websocket)
            if not self.rooms[room]:
                del self.rooms[room]

    async def broadcast(self, message: dict, room: str = "general"):
        """Broadcasts payload to subscribers of a specific room or to all if 'general'"""
        targets = set()
        if room in self.rooms:
            targets.update(self.rooms[room])
        if "general" in self.rooms and room != "general":
            targets.update(self.rooms["general"])

        dead_sockets = set()
        for ws in targets:
            try:
                await ws.send_json(message)
            except Exception:
                dead_sockets.add(ws)

        for ws in dead_sockets:
            for r in list(self.rooms.keys()):
                self.rooms[r].discard(ws)

manager = QueueConnectionManager()

@router.websocket("/ws/queue")
async def websocket_queue_general(websocket: WebSocket):
    await manager.connect(websocket, "general")
    try:
        # Send initial confirmation
        await websocket.send_json({
            "type": "CONNECTED",
            "message": "Subscribed to live MediKiosk OPD queue updates"
        })
        while True:
            # Keep socket alive and accept ping/heartbeats
            data = await websocket.receive_text()
            if data == "ping":
                await websocket.send_text("pong")
    except WebSocketDisconnect:
        manager.disconnect(websocket, "general")
    except Exception:
        manager.disconnect(websocket, "general")

@router.websocket("/ws/queue/{room}")
async def websocket_queue_room(websocket: WebSocket, room: str):
    await manager.connect(websocket, room)
    try:
        await websocket.send_json({
            "type": "CONNECTED",
            "room": room,
            "message": f"Subscribed to live queue for {room}"
        })
        while True:
            data = await websocket.receive_text()
            if data == "ping":
                await websocket.send_text("pong")
    except WebSocketDisconnect:
        manager.disconnect(websocket, room)
    except Exception:
        manager.disconnect(websocket, room)

async def notify_queue_change(
    token_number: int,
    status: str,
    room: str = "Room 4B",
    patient_name: str = "",
    patient_id: str = ""
):
    """Utility to broadcast queue advancement from any route"""
    payload = {
        "type": "QUEUE_ADVANCED",
        "token": token_number,
        "status": status,
        "room": room,
        "patientName": patient_name,
        "patientId": patient_id
    }
    await manager.broadcast(payload, room)
    await manager.broadcast(payload, "general")
