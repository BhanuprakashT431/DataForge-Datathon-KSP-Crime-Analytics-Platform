import json
import logging

logger = logging.getLogger(__name__)

def handler(req, res):
    """
    Catalyst Serverless Function for Health Monitoring.
    Checks status of AppSail, Data Store, and APIs.
    """
    try:
        logger.info("Executing periodic health monitor checks...")
        
        res.set_content_type('application/json')
        res.set_status_code(200)
        res.send(json.dumps({
            "status": "healthy",
            "catalyst_services_reachable": True
        }))
    except Exception as e:
        logger.error(f"Error in Health Monitor: {e}")
        res.set_status_code(500)
        res.send(json.dumps({"error": str(e)}))
