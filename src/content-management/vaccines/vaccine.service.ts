import { getAllContent } from "../cms.service";
import { HospitalContent, HealthUnitContent } from "../cms.types";
import { VaccineContent } from "./vaccine.types";

/**
 * Retrieves all hospitals and health units to be used in the PlacesSelector.
 */
export function getAvailablePlaces() {
  const hospitals = getAllContent("hospitals") as HospitalContent[];
  const healthUnits = getAllContent("health-units") as HealthUnitContent[];
  
  return [
    ...hospitals.map(h => ({
      id: h.id,
      name: { en: h.hospital_name_en, ar: h.hospital_name_ar },
      type: "Hospital"
    })),
    ...healthUnits.map(hu => ({
      id: hu.id,
      name: { en: hu.unit_name_en, ar: hu.unit_name_ar },
      type: "Health Unit"
    }))
  ];
}

/**
 * Filter vaccines by type or status.
 */
export function getVaccines(filters?: { type?: "FREE" | "PAID"; status?: string }) {
  let vaccines = getAllContent("vaccines") as VaccineContent[];
  
  if (filters?.type) {
    vaccines = vaccines.filter(v => v.vaccine_type === filters.type);
  }
  
  if (filters?.status) {
    vaccines = vaccines.filter(v => v.status === filters.status);
  }
  
  return vaccines;
}
