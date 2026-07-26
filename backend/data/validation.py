import sys
from .mock_generator import db

def validate_schema_and_data():
    print("Running Enterprise Validation Pipeline...")
    
    cases = db.transaction_data["CaseMaster"]
    units = db.ref_data["units"]
    employees = db.ref_data["employees"]
    accused = db.transaction_data["Accused"]

    errors = []

    if not cases:
        errors.append("No cases generated.")

    # Validate Case -> Unit relationship
    unit_ids = {u.UnitID for u in units}
    for case in cases:
        if case.PoliceStationID not in unit_ids:
            errors.append(f"Case {case.CaseMasterID} has invalid PoliceStationID {case.PoliceStationID}")

    # Validate Case -> Employee (IO)
    employee_ids = {e.EmployeeID for e in employees}
    for case in cases:
        if case.PolicePersonID not in employee_ids:
            errors.append(f"Case {case.CaseMasterID} has invalid PolicePersonID {case.PolicePersonID}")

    # Validate Accused -> Case
    case_ids = {c.CaseMasterID for c in cases}
    for a in accused:
        if a.CaseMasterID not in case_ids:
            errors.append(f"Accused {a.AccusedMasterID} linked to invalid CaseMasterID {a.CaseMasterID}")

    if errors:
        print("❌ Enterprise Validation Failed:")
        for err in errors[:10]:
            print(f"  - {err}")
        if len(errors) > 10:
            print(f"  ... and {len(errors) - 10} more errors.")
        sys.exit(1)
    
    print("✅ Enterprise Validation Passed. ER Schema relationships are intact.")

if __name__ == "__main__":
    validate_schema_and_data()
