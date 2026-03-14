from __future__ import annotations

from pydantic import BaseModel


class BitdefenderConnectionRequest(BaseModel):
    api_key: str = "cf56b6be22938008f4495cfa15844ae59796311595355e6bc2eb356a3fd5f37c"
    base_url: str = "https://cloud.gravityzone.bitdefender.com/api/v1.0/jsonrpc"
    parent_id: str | None = None
