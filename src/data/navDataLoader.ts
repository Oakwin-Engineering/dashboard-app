import { SvgIconComponent } from "@mui/icons-material";
import Apartment from "@mui/icons-material/Apartment";
import Business from "@mui/icons-material/Business";
import Person from "@mui/icons-material/Person";

// Defines the structure of the navigation items
export interface NavDataItem {
  label: string;
  icon: SvgIconComponent;
  children?: NavDataItem[];
}

// Defines the structure of a row in our claims JSON data
interface ClaimsDataRow {
  facility_name: string;
  rendering_provider_name: string;
}

// Main function to load and transform the data
export const loadNavData = async (): Promise<NavDataItem[]> => {
  try {
    const response = await fetch("/csv.data/Submitted Claims Report/All Data/claims_data.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: ClaimsDataRow[] = await response.json();

    // Use a Map to build the hierarchy: { facility -> Set(provider, provider) }
    const facilityProviderMap = new Map<string, Set<string>>();

    for (const row of data) {
      if (row.facility_name && row.rendering_provider_name) {
        if (!facilityProviderMap.has(row.facility_name)) {
          facilityProviderMap.set(row.facility_name, new Set<string>());
        }
        facilityProviderMap.get(row.facility_name)!.add(row.rendering_provider_name);
      }
    }

    // Convert the Map into the NavDataItem structure
    const locations = Array.from(facilityProviderMap.keys()).sort().map((facilityName) => {
      const providers = Array.from(facilityProviderMap.get(facilityName)!).sort().map((providerName) => ({
        label: providerName,
        icon: Person,
      }));

      return {
        label: facilityName,
        icon: Business,
        children: providers,
      };
    });

    // Create the final structure with the 'Overall' tab
    const finalNavData: NavDataItem[] = [
      {
        label: "Overall",
        icon: Apartment,
        children: locations,
      },
    ];

    return finalNavData;

  } catch (error) {
    console.error("Failed to load or process navigation data:", error);
    return []; // Return an empty array on error
  }
};
