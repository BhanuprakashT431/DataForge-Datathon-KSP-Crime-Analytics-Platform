from typing import List, Optional, ForwardRef
from datetime import date, datetime
from pydantic import BaseModel, Field

# Base Models representing the KSP ER Diagram

class State(BaseModel):
    StateID: int
    StateName: str
    NationalityID: int
    Active: int = 1

class District(BaseModel):
    DistrictID: int
    DistrictName: str
    StateID: int
    Active: int = 1

class UnitType(BaseModel):
    UnitTypeID: int
    UnitTypeName: str
    CityDistState: str
    Hierarchy: int
    Active: int = 1

class Unit(BaseModel):
    UnitID: int
    UnitName: str
    TypeID: int
    ParentUnit: Optional[int]
    NationalityID: int
    StateID: int
    DistrictID: int
    Active: int = 1

class Rank(BaseModel):
    RankID: int
    RankName: str
    Hierarchy: int
    Active: int = 1

class Designation(BaseModel):
    DesignationID: int
    DesignationName: str
    Active: int = 1
    SortOrder: int

class Employee(BaseModel):
    EmployeeID: int
    DistrictID: int
    UnitID: int
    RankID: int
    DesignationID: int
    KGID: str
    FirstName: str
    EmployeeDOB: date
    GenderID: int
    BloodGroupID: int
    PhysicallyChallenged: int
    AppointmentDate: date

class Court(BaseModel):
    CourtID: int
    CourtName: str
    DistrictID: int
    StateID: int
    Active: int = 1

class CaseCategory(BaseModel):
    CaseCategoryID: int
    LookupValue: str

class GravityOffence(BaseModel):
    GravityOffenceID: int
    LookupValue: str

class CrimeHead(BaseModel):
    CrimeHeadID: int
    CrimeGroupName: str
    Active: int = 1

class CrimeSubHead(BaseModel):
    CrimeSubHeadID: int
    CrimeHeadID: int
    CrimeHeadName: str
    SeqID: int

class Act(BaseModel):
    ActCode: str
    ActDescription: str
    ShortName: str
    Active: int = 1

class Section(BaseModel):
    ActCode: str
    SectionCode: str
    SectionDescription: str
    Active: int = 1

class CaseStatusMaster(BaseModel):
    CaseStatusID: int
    CaseStatusName: str

class OccupationMaster(BaseModel):
    OccupationID: int
    OccupationName: str

class ReligionMaster(BaseModel):
    ReligionID: int
    ReligionName: str

class CasteMaster(BaseModel):
    caste_master_id: int
    caste_master_name: str

class CaseMaster(BaseModel):
    CaseMasterID: int
    CrimeNo: str
    CaseNo: str
    CrimeRegisteredDate: date
    PolicePersonID: int
    PoliceStationID: int
    CaseCategoryID: int
    GravityOffenceID: int
    CrimeMajorHeadID: int
    CrimeMinorHeadID: int
    CaseStatusID: int
    CourtID: Optional[int]
    IncidentFromDate: datetime
    IncidentToDate: datetime
    InfoReceivedPSDate: datetime
    latitude: float
    longitude: float
    BriefFacts: str

class Victim(BaseModel):
    VictimMasterID: int
    CaseMasterID: int
    VictimName: str
    AgeYear: int
    GenderID: int
    VictimPolice: str

class Accused(BaseModel):
    AccusedMasterID: int
    CaseMasterID: int
    AccusedName: str
    AgeYear: int
    GenderID: int
    PersonID: str

class ComplainantDetails(BaseModel):
    ComplainantID: int
    CaseMasterID: int
    ComplainantName: str
    AgeYear: int
    OccupationID: int
    ReligionID: int
    CasteID: int
    GenderID: int

class ArrestSurrender(BaseModel):
    ArrestSurrenderID: int
    CaseMasterID: int
    ArrestSurrenderTypeID: int
    ArrestSurrenderDate: date
    ArrestSurrenderStateId: int
    ArrestSurrenderDistrictId: int
    PoliceStationID: int
    IOID: int
    CourtID: Optional[int]
    AccusedMasterID: int
    IsAccused: int
    IsComplainantAccused: int

class ChargesheetDetails(BaseModel):
    CSID: int
    CaseMasterID: int
    csdate: datetime
    cstype: str
    PolicePersonID: int

class ActSectionAssociation(BaseModel):
    CaseMasterID: int
    ActID: str
    SectionID: str
    ActOrderID: int
    SectionOrderID: int
