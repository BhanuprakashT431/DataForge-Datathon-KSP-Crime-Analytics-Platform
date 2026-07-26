"""
Zoho Catalyst Integration Module
Wraps Catalyst SDK calls and handles graceful degradation to local mock data
when Catalyst credentials are not present or enabled.
"""

import os
import logging
from typing import Dict, Any, List, Optional

try:
    import zcatalyst_sdk
    CATALYST_SDK_AVAILABLE = True
except ImportError:
    CATALYST_SDK_AVAILABLE = False

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CatalystService:
    def __init__(self):
        self.project_id = os.environ.get("CATALYST_PROJECT_ID", "ksp-crime-intel-demo")
        self.env = os.environ.get("CATALYST_ENVIRONMENT", "Development")
        self.use_data_store = os.environ.get("ENABLE_CATALYST_DATA_STORE", "false").lower() == "true"
        self.use_cache = os.environ.get("ENABLE_CATALYST_CACHE", "false").lower() == "true"
        self.use_stratus = os.environ.get("ENABLE_CATALYST_STRATUS", "false").lower() == "true"
        self.use_zcql = os.environ.get("ENABLE_CATALYST_ZCQL", "false").lower() == "true"

        # Initialize SDK if available and explicitly enabled via env
        self.catalyst_app = None
        if CATALYST_SDK_AVAILABLE and (self.use_data_store or self.use_cache or self.use_stratus):
            try:
                # Normally zcatalyst_sdk.initialize() is called within the request scope in Catalyst AppSail
                # We do a basic init here for standalone tests if needed, but rely on request object in routes.
                pass
            except Exception as e:
                logger.warning(f"Failed to initialize Catalyst SDK: {e}. Falling back to Local Development Mode.")
                self.disable_all_catalyst_services()
        elif not CATALYST_SDK_AVAILABLE:
            logger.info("zcatalyst_sdk not installed. Operating in Local Development Mode.")
            self.disable_all_catalyst_services()

    def disable_all_catalyst_services(self):
        self.use_data_store = False
        self.use_cache = False
        self.use_stratus = False
        self.use_zcql = False

    # --- Data Store (Relational Database) ---
    def get_cases(self, catalyst_req_app=None) -> List[Dict[str, Any]]:
        """
        Retrieves Cases from Catalyst Data Store.
        Falls back to local mock_generator if Catalyst is disabled.
        """
        if self.use_data_store and catalyst_req_app:
            try:
                datastore = catalyst_req_app.datastore()
                table = datastore.table("CaseMaster")
                return table.get_all_rows()
            except Exception as e:
                logger.error(f"Catalyst DataStore error: {e}. Falling back to local data.")
        
        # Local Fallback
        from data.mock_generator import db
        return db.get_cases()

    def get_units(self, catalyst_req_app=None) -> List[Dict[str, Any]]:
        if self.use_data_store and catalyst_req_app:
            try:
                datastore = catalyst_req_app.datastore()
                table = datastore.table("Unit")
                return table.get_all_rows()
            except Exception as e:
                logger.error(f"Catalyst DataStore error: {e}")
        
        # Local Fallback
        from data.mock_generator import db
        return db.get_units()

    def get_accused(self, catalyst_req_app=None) -> List[Dict[str, Any]]:
        if self.use_data_store and catalyst_req_app:
            try:
                datastore = catalyst_req_app.datastore()
                table = datastore.table("Accused")
                return table.get_all_rows()
            except Exception as e:
                logger.error(f"Catalyst DataStore error: {e}")
        
        # Local Fallback
        from data.mock_generator import db
        return db.get_accused()

    # --- ZCQL (Advanced Queries) ---
    def execute_query(self, query: str, catalyst_req_app=None):
        """Execute ZCQL query on Catalyst."""
        if self.use_zcql and catalyst_req_app:
            try:
                zcql = catalyst_req_app.zcql()
                return zcql.execute_query(query)
            except Exception as e:
                logger.error(f"ZCQL error: {e}")
                return []
        logger.info(f"Local mock fallback for ZCQL query: {query}")
        return []

    # --- Cache ---
    def get_cache_value(self, key: str, segment_id: int = 1, catalyst_req_app=None):
        if self.use_cache and catalyst_req_app:
            try:
                cache = catalyst_req_app.cache().segment(segment_id)
                return cache.get_value(key)
            except Exception as e:
                logger.error(f"Catalyst Cache Error: {e}")
        return None

    def put_cache_value(self, key: str, value: str, expiry_in_hours: int = 1, segment_id: int = 1, catalyst_req_app=None):
        if self.use_cache and catalyst_req_app:
            try:
                cache = catalyst_req_app.cache().segment(segment_id)
                cache.put_value(key, value, expiry_in_hours)
            except Exception as e:
                logger.error(f"Catalyst Cache Error: {e}")

    # --- Stratus (Object Storage) ---
    def get_file_url(self, file_id: str, folder_id: int, catalyst_req_app=None):
        if self.use_stratus and catalyst_req_app:
            try:
                folder = catalyst_req_app.filestore().folder(folder_id)
                return folder.get_file(file_id)
            except Exception as e:
                logger.error(f"Catalyst Stratus Error: {e}")
        return f"/mock_stratus/{folder_id}/{file_id}"

# Global singleton
catalyst_service = CatalystService()
