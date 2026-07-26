"""
ML: Explainable AI Engine & Responsible AI Framework
Provides standard XAI wrappers for all local ML models.
"""

from typing import Dict, Any, List
import datetime

class ExplainableAIFramework:
    MODEL_VERSION = "1.0.0"

    @classmethod
    def wrap_prediction(
        cls, 
        prediction: Any, 
        confidence: float, 
        reason: str, 
        evidence: List[str], 
        algorithm: str, 
        feature_importance: Dict[str, float] = None,
        recommended_action: str = "Investigate further"
    ) -> Dict[str, Any]:
        """
        Wraps any prediction in a Responsible AI envelope.
        """
        conf_level = "High" if confidence > 0.8 else ("Medium" if confidence > 0.5 else "Low")
        
        return {
            "prediction": prediction,
            "confidence_score": round(confidence * 100, 1),
            "confidence_level": conf_level,
            "evidence_used": evidence,
            "algorithm_used": algorithm,
            "feature_importance": feature_importance or {},
            "timestamp": datetime.datetime.utcnow().isoformat(),
            "model_version": cls.MODEL_VERSION,
            "reason": reason,
            "human_review_required": confidence < 0.6,
            "recommended_action": recommended_action
        }

    @staticmethod
    def format_xai_for_ui(xai_payload: Dict[str, Any]) -> str:
        """Converts XAI payload to a readable string for the UI."""
        return (
            f"Prediction: {xai_payload['prediction']}\n"
            f"Reason: {xai_payload['reason']}\n"
            f"Confidence: {xai_payload['confidence_score']}% ({xai_payload['confidence_level']})\n"
            f"Recommendation: {xai_payload['recommended_action']}"
        )

