import os
import random
import uuid
from datetime import datetime, timedelta, date
from typing import List, Dict, Any
from collections import defaultdict
from .schema import (
    State, District, UnitType, Unit, Rank, Designation, Employee,
    Court, CaseCategory, GravityOffence, CrimeHead, CrimeSubHead,
    Act, Section, CaseStatusMaster, OccupationMaster, ReligionMaster, CasteMaster,
    CaseMaster, Victim, Accused, ComplainantDetails, ArrestSurrender,
    ChargesheetDetails, ActSectionAssociation
)

# ─── Reference Data Initialization ────────────────────────────────────────────
def generate_reference_data():
    # 1. State
    state = State(StateID=1, StateName="Karnataka", NationalityID=1)

    # 2. Districts
    district_names = ["Bengaluru Urban", "Mysuru", "Mangaluru", "Hubballi-Dharwad", "Belagavi", "Ballari", "Kalaburagi"]
    districts = [District(DistrictID=i+1, DistrictName=name, StateID=1) for i, name in enumerate(district_names)]

    # 3. Unit Types
    unit_types = [
        UnitType(UnitTypeID=1, UnitTypeName="Police Station", CityDistState="City", Hierarchy=1),
        UnitType(UnitTypeID=2, UnitTypeName="Circle Office", CityDistState="City", Hierarchy=2)
    ]

    # 4. Units (Police Stations)
    units = []
    unit_id = 1
    for d in districts:
        for j in range(3): # 3 PS per district
            units.append(Unit(
                UnitID=unit_id,
                UnitName=f"{d.DistrictName} PS {j+1}",
                TypeID=1,
                ParentUnit=None,
                NationalityID=1,
                StateID=1,
                DistrictID=d.DistrictID
            ))
            unit_id += 1

    # 5. Ranks & Designations
    ranks = [
        Rank(RankID=1, RankName="Inspector", Hierarchy=1),
        Rank(RankID=2, RankName="Sub-Inspector", Hierarchy=2),
        Rank(RankID=3, RankName="Constable", Hierarchy=3)
    ]
    designations = [
        Designation(DesignationID=1, DesignationName="SHO", SortOrder=1),
        Designation(DesignationID=2, DesignationName="Investigating Officer", SortOrder=2),
        Designation(DesignationID=3, DesignationName="Beat Officer", SortOrder=3)
    ]

    # 6. Employees
    employees = []
    emp_id = 1
    for u in units:
        # 1 SHO, 2 IOs per unit
        employees.append(Employee(
            EmployeeID=emp_id, DistrictID=u.DistrictID, UnitID=u.UnitID,
            RankID=1, DesignationID=1, KGID=f"KGID{emp_id}", FirstName=f"Officer_{emp_id}",
            EmployeeDOB=date(1980, 1, 1), GenderID=1, BloodGroupID=1, PhysicallyChallenged=0, AppointmentDate=date(2005, 1, 1)
        ))
        emp_id += 1
        for _ in range(2):
            employees.append(Employee(
                EmployeeID=emp_id, DistrictID=u.DistrictID, UnitID=u.UnitID,
                RankID=2, DesignationID=2, KGID=f"KGID{emp_id}", FirstName=f"Officer_{emp_id}",
                EmployeeDOB=date(1985, 1, 1), GenderID=1, BloodGroupID=1, PhysicallyChallenged=0, AppointmentDate=date(2010, 1, 1)
            ))
            emp_id += 1

    # 7. Courts
    courts = []
    for d in districts:
        courts.append(Court(CourtID=d.DistrictID, CourtName=f"{d.DistrictName} District Court", DistrictID=d.DistrictID, StateID=1))

    # 8. Categories, Gravity
    categories = [
        CaseCategory(CaseCategoryID=1, LookupValue="FIR"),
        CaseCategory(CaseCategoryID=2, LookupValue="UDR")
    ]
    gravities = [
        GravityOffence(GravityOffenceID=1, LookupValue="Heinous"),
        GravityOffence(GravityOffenceID=2, LookupValue="Non-Heinous")
    ]

    # 9. Crime Heads
    crime_heads = [
        CrimeHead(CrimeHeadID=1, CrimeGroupName="Crimes Against Body"),
        CrimeHead(CrimeHeadID=2, CrimeGroupName="Property Crimes"),
        CrimeHead(CrimeHeadID=3, CrimeGroupName="Cyber Crimes")
    ]
    crime_sub_heads = [
        CrimeSubHead(CrimeSubHeadID=1, CrimeHeadID=1, CrimeHeadName="Murder", SeqID=1),
        CrimeSubHead(CrimeSubHeadID=2, CrimeHeadID=1, CrimeHeadName="Assault", SeqID=2),
        CrimeSubHead(CrimeSubHeadID=3, CrimeHeadID=2, CrimeHeadName="Theft", SeqID=1),
        CrimeSubHead(CrimeSubHeadID=4, CrimeHeadID=2, CrimeHeadName="Burglary", SeqID=2),
        CrimeSubHead(CrimeSubHeadID=5, CrimeHeadID=3, CrimeHeadName="Phishing", SeqID=1)
    ]

    # 10. Acts & Sections
    acts = [
        Act(ActCode="IPC", ActDescription="Indian Penal Code", ShortName="IPC"),
        Act(ActCode="IT", ActDescription="Information Technology Act", ShortName="IT Act")
    ]
    sections = [
        Section(ActCode="IPC", SectionCode="302", SectionDescription="Punishment for murder"),
        Section(ActCode="IPC", SectionCode="378", SectionDescription="Theft"),
        Section(ActCode="IT", SectionCode="66", SectionDescription="Computer related offences")
    ]

    # 11. Lookups
    case_statuses = [
        CaseStatusMaster(CaseStatusID=1, CaseStatusName="Under Investigation"),
        CaseStatusMaster(CaseStatusID=2, CaseStatusName="Charge Sheeted"),
        CaseStatusMaster(CaseStatusID=3, CaseStatusName="Closed")
    ]
    occupations = [OccupationMaster(OccupationID=1, OccupationName="Business"), OccupationMaster(OccupationID=2, OccupationName="Service")]
    religions = [ReligionMaster(ReligionID=1, ReligionName="Hindu"), ReligionMaster(ReligionID=2, ReligionName="Muslim")]
    castes = [CasteMaster(caste_master_id=1, caste_master_name="General")]

    return {
        "state": state, "districts": districts, "units": units, "employees": employees, "courts": courts,
        "categories": categories, "gravities": gravities, "crime_heads": crime_heads, "crime_sub_heads": crime_sub_heads,
        "acts": acts, "sections": sections, "case_statuses": case_statuses, "occupations": occupations,
        "religions": religions, "castes": castes
    }


def generate_firs(ref_data: Dict[str, Any], count: int = 100):
    cases = []
    victims = []
    accused_list = []
    complainants = []
    arrests = []
    chargesheets = []
    act_sections = []

    units = ref_data["units"]
    employees = ref_data["employees"]
    courts = ref_data["courts"]
    sub_heads = ref_data["crime_sub_heads"]

    start_date = datetime(2023, 1, 1)

    for i in range(1, count + 1):
        unit = random.choice(units)
        # Find IO in this unit
        unit_employees = [e for e in employees if e.UnitID == unit.UnitID]
        io = random.choice(unit_employees)
        court = next((c for c in courts if c.DistrictID == unit.DistrictID), courts[0])
        sub_head = random.choice(sub_heads)

        # Base geocoords for Karnataka (around Bangalore / Mysore / Mangalore roughly)
        lat = 12.9716 + random.uniform(-1.0, 3.0)
        lng = 77.5946 + random.uniform(-1.0, 1.0)

        incident_date = start_date + timedelta(days=random.randint(0, 700), hours=random.randint(0, 23))
        
        status = random.choice(ref_data["case_statuses"])
        category = random.choice(ref_data["categories"])
        
        # CrimeNo format: 1 (Category) + 4 (District) + 4 (Unit) + 4 (Year) + 5 (Serial)
        district_id_str = f"{unit.DistrictID:04d}"
        unit_id_str = f"{unit.UnitID:04d}"
        year_str = f"{incident_date.year}"
        serial_str = f"{i:05d}"
        crime_no = f"{category.CaseCategoryID}{district_id_str}{unit_id_str}{year_str}{serial_str}"
        case_no = f"{year_str}{serial_str}"

        case = CaseMaster(
            CaseMasterID=i,
            CrimeNo=crime_no,
            CaseNo=case_no,
            CrimeRegisteredDate=incident_date.date(),
            PolicePersonID=io.EmployeeID,
            PoliceStationID=unit.UnitID,
            CaseCategoryID=category.CaseCategoryID,
            GravityOffenceID=1 if sub_head.CrimeHeadID == 1 else 2,
            CrimeMajorHeadID=sub_head.CrimeHeadID,
            CrimeMinorHeadID=sub_head.CrimeSubHeadID,
            CaseStatusID=status.CaseStatusID,
            CourtID=court.CourtID,
            IncidentFromDate=incident_date,
            IncidentToDate=incident_date + timedelta(hours=2),
            InfoReceivedPSDate=incident_date + timedelta(hours=3),
            latitude=round(lat, 5),
            longitude=round(lng, 5),
            BriefFacts=f"Incident of {sub_head.CrimeHeadName} reported at {unit.UnitName}"
        )
        cases.append(case)

        # Victim
        victims.append(Victim(
            VictimMasterID=i, CaseMasterID=i, VictimName=f"Victim_{i}", AgeYear=random.randint(20, 60), GenderID=1, VictimPolice="0"
        ))

        # Complainant
        complainants.append(ComplainantDetails(
            ComplainantID=i, CaseMasterID=i, ComplainantName=f"Complainant_{i}", AgeYear=random.randint(25, 55),
            OccupationID=1, ReligionID=1, CasteID=1, GenderID=1
        ))

        # Accused
        accused_id = i
        accused = Accused(
            AccusedMasterID=accused_id, CaseMasterID=i, AccusedName=f"Accused_{accused_id}",
            AgeYear=random.randint(18, 50), GenderID=1, PersonID=f"P{accused_id}"
        )
        accused_list.append(accused)

        # Act & Section
        act = random.choice(ref_data["acts"])
        sec = next((s for s in ref_data["sections"] if s.ActCode == act.ActCode), ref_data["sections"][0])
        act_sections.append(ActSectionAssociation(
            CaseMasterID=i, ActID=act.ActCode, SectionID=sec.SectionCode, ActOrderID=1, SectionOrderID=1
        ))

        # Arrest/Surrender & Chargesheet (if applicable)
        if status.CaseStatusID in [2, 3]: # Charge Sheeted or Closed
            arrests.append(ArrestSurrender(
                ArrestSurrenderID=i, CaseMasterID=i, ArrestSurrenderTypeID=1, ArrestSurrenderDate=(incident_date + timedelta(days=5)).date(),
                ArrestSurrenderStateId=1, ArrestSurrenderDistrictId=unit.DistrictID, PoliceStationID=unit.UnitID, IOID=io.EmployeeID,
                CourtID=court.CourtID, AccusedMasterID=accused_id, IsAccused=1, IsComplainantAccused=0
            ))
        if status.CaseStatusID == 2:
            chargesheets.append(ChargesheetDetails(
                CSID=i, CaseMasterID=i, csdate=incident_date + timedelta(days=30), cstype="A", PolicePersonID=io.EmployeeID
            ))

    return {
        "CaseMaster": cases,
        "Victim": victims,
        "Accused": accused_list,
        "ComplainantDetails": complainants,
        "ArrestSurrender": arrests,
        "ChargesheetDetails": chargesheets,
        "ActSectionAssociation": act_sections
    }

class Database:
    def __init__(self):
        size = int(os.environ.get("DATASET_SIZE", "1000"))
        print(f"⚡ Generating {size} synthetic records conforming to KSP schema...")
        self.ref_data = generate_reference_data()
        self.transaction_data = generate_firs(self.ref_data, count=size)
        print("✅ Data generation complete.")

    def get_cases(self):
        return [c.model_dump() for c in self.transaction_data["CaseMaster"]]
    
    def get_accused(self):
        return [a.model_dump() for a in self.transaction_data["Accused"]]

    def get_units(self):
        return [u.model_dump() for u in self.ref_data["units"]]

# Singleton instance
db = Database()
