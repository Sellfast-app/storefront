import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React from 'react';

// --- Comprehensive Static Data for Key Countries ---

// Nigeria (NG)
const nigerianStates = [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", 
    "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo", 
    "Ekiti", "Enugu", "Federal Capital Territory", "Gombe", "Imo", 
    "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", 
    "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", 
    "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
];

// United States (US)
const usStates = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
    "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
    "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
    "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
    "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
    "New Hampshire", "New Jersey", "New Mexico", "New York",
    "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
    "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
    "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
    "West Virginia", "Wisconsin", "Wyoming"
];

// Canada (CA)
const canadianProvinces = [
    "Alberta", "British Columbia", "Manitoba", "New Brunswick", 
    "Newfoundland and Labrador", "Nova Scotia", "Ontario", "Prince Edward Island",
    "Quebec", "Saskatchewan", "Northwest Territories", "Nunavut", "Yukon"
];

// Mexico (MX)
const mexicanStates = [
    "Aguascalientes", "Baja California", "Baja California Sur", "Campeche",
    "Chiapas", "Chihuahua", "Coahuila", "Colima", "Mexico City",
    "Durango", "Guanajuato", "Guerrero", "Hidalgo", "Jalisco",
    "México", "Michoacán", "Morelos", "Nayarit", "Nuevo León",
    "Oaxaca", "Puebla", "Querétaro", "Quintana Roo", "San Luis Potosí",
    "Sinaloa", "Sonora", "Tabasco", "Tamaulipas", "Tlaxcala",
    "Veracruz", "Yucatán", "Zacatecas"
];

// Caribbean Countries
// Dominican Republic (DO)
const dominicanProvinces = [
    "Azua", "Bahoruco", "Barahona", "Dajabón", "Distrito Nacional",
    "Duarte", "Elías Piña", "El Seibo", "Espaillat", "Hato Mayor",
    "Hermanas Mirabal", "Independencia", "La Altagracia", "La Romana",
    "La Vega", "María Trinidad Sánchez", "Monseñor Nouel",
    "Monte Cristi", "Monte Plata", "Pedernales", "Peravia",
    "Puerto Plata", "Samaná", "San Cristóbal", "San José de Ocoa",
    "San Juan", "San Pedro de Macorís", "Sánchez Ramírez",
    "Santiago", "Santiago Rodríguez", "Santo Domingo", "Valverde"
];

// Cuba (CU)
const cubanProvinces = [
    "Artemisa", "Camagüey", "Ciego de Ávila", "Cienfuegos",
    "Granma", "Guantánamo", "Havana", "Holguín", "Isla de la Juventud",
    "Las Tunas", "Matanzas", "Mayabeque", "Pinar del Río",
    "Sancti Spíritus", "Santiago de Cuba", "Villa Clara"
];

// Jamaica (JM)
const jamaicanParishes = [
    "Kingston", "St. Andrew", "St. Thomas", "Portland",
    "St. Mary", "St. Ann", "Trelawny", "St. James",
    "Hanover", "Westmoreland", "St. Elizabeth", "Manchester",
    "Clarendon", "St. Catherine"
];

// Haiti (HT)
const haitianDepartments = [
    "Artibonite", "Centre", "Grand'Anse", "Nippes",
    "Nord", "Nord-Est", "Nord-Ouest", "Ouest",
    "Sud", "Sud-Est"
];

// Central American Countries
// Guatemala (GT)
const guatemalanDepartments = [
    "Alta Verapaz", "Baja Verapaz", "Chimaltenango", "Chiquimula",
    "El Progreso", "Escuintla", "Guatemala", "Huehuetenango",
    "Izabal", "Jalapa", "Jutiapa", "Petén", "Quetzaltenango",
    "Quiché", "Retalhuleu", "Sacatepéquez", "San Marcos",
    "Santa Rosa", "Sololá", "Suchitepéquez", "Totonicapán", "Zacapa"
];

// Costa Rica (CR)
const costaRicanProvinces = [
    "Alajuela", "Cartago", "Guanacaste", "Heredia",
    "Limón", "Puntarenas", "San José"
];

// Panama (PA)
const panamanianProvinces = [
    "Bocas del Toro", "Chiriquí", "Coclé", "Colón",
    "Darién", "Herrera", "Los Santos", "Panamá",
    "Panamá Oeste", "Veraguas"
];

// Honduras (HN)
const honduranDepartments = [
    "Atlántida", "Choluteca", "Colón", "Comayagua",
    "Copán", "Cortés", "El Paraíso", "Francisco Morazán",
    "Gracias a Dios", "Intibucá", "Islas de la Bahía",
    "La Paz", "Lempira", "Ocotepeque", "Olancho",
    "Santa Bárbara", "Valle", "Yoro"
];

// El Salvador (SV)
const salvadoranDepartments = [
    "Ahuachapán", "Cabañas", "Chalatenango", "Cuscatlán",
    "La Libertad", "La Paz", "La Unión", "Morazán",
    "San Miguel", "San Salvador", "San Vicente",
    "Santa Ana", "Sonsonate", "Usulután"
];

// Nicaragua (NI)
const nicaraguanDepartments = [
    "Boaco", "Carazo", "Chinandega", "Chontales",
    "Estelí", "Granada", "Jinotega", "León",
    "Madriz", "Managua", "Masaya", "Matagalpa",
    "Nueva Segovia", "Río San Juan", "Rivas",
    "North Caribbean Coast", "South Caribbean Coast"
];

// Belize (BZ)
const belizeanDistricts = [
    "Belize", "Cayo", "Corozal", "Orange Walk",
    "Stann Creek", "Toledo"
];

// Other North American Countries
// Bahamas (BS)
const bahamianDistricts = [
    "Acklins", "Berry Islands", "Bimini", "Black Point",
    "Cat Island", "Central Abaco", "Central Andros",
    "Central Eleuthera", "City of Freeport", "Crooked Island",
    "East Grand Bahama", "Exuma", "Grand Cay", "Harbour Island",
    "Hope Town", "Inagua", "Long Island", "Mangrove Cay",
    "Mayaguana", "Moore's Island", "North Abaco", "North Andros",
    "North Eleuthera", "Ragged Island", "Rum Cay", "San Salvador",
    "South Abaco", "South Andros", "South Eleuthera", "Spanish Wells",
    "West Grand Bahama"
];

// Trinidad and Tobago (TT)
const trinidadTobagoRegions = [
    "Arima", "Chaguanas", "Couva-Tabaquite-Talparo", "Diego Martin",
    "Eastern Tobago", "Penal-Debe", "Point Fortin", "Port of Spain",
    "Princes Town", "Rio Claro-Mayaro", "San Fernando", "San Juan-Laventille",
    "Sangre Grande", "Siparia", "Tunapuna-Piarco", "Western Tobago"
];

// Barbados (BB)
const barbadianParishes = [
    "Christ Church", "Saint Andrew", "Saint George", "Saint James",
    "Saint John", "Saint Joseph", "Saint Lucy", "Saint Michael",
    "Saint Peter", "Saint Philip", "Saint Thomas"
];

// United Kingdom (GB)
const ukRegions = [
    "England", "Scotland", "Wales", "Northern Ireland"
];

// Australia (AU)
const australianStates = [
    "New South Wales", "Queensland", "South Australia", "Tasmania", 
    "Victoria", "Western Australia", "Australian Capital Territory", 
    "Northern Territory"
];

// Germany (DE)
const germanStates = [
    "Baden-Württemberg", "Bavaria", "Berlin", "Brandenburg", "Bremen", 
    "Hamburg", "Hesse", "Lower Saxony", "Mecklenburg-Vorpommern", 
    "North Rhine-Westphalia", "Rhineland-Palatinate", "Saarland", 
    "Saxony", "Saxony-Anhalt", "Schleswig-Holstein", "Thuringia"
];

// France (FR)
const frenchRegions = [
    "Auvergne-Rhône-Alpes", "Bourgogne-Franche-Comté", "Brittany", 
    "Centre-Val de Loire", "Corsica", "Grand Est", "Hauts-de-France", 
    "Île-de-France", "Normandy", "Nouvelle-Aquitaine", "Occitanie", 
    "Pays de la Loire", "Provence-Alpes-Côte d'Azur"
];

// Italy (IT)
const italianRegions = [
    "Abruzzo", "Aosta Valley", "Apulia", "Basilicata", "Calabria", 
    "Campania", "Emilia-Romagna", "Friuli-Venezia Giulia", "Lazio", 
    "Liguria", "Lombardy", "Marche", "Molise", "Piedmont", "Sardinia", 
    "Sicily", "Trentino-Alto Adige", "Tuscany", "Umbria", "Veneto"
];

// Spain (ES)
const spanishRegions = [
    "Andalusia", "Aragon", "Asturias", "Balearic Islands", "Basque Country", 
    "Canary Islands", "Cantabria", "Castile and León", "Castilla-La Mancha", 
    "Catalonia", "Extremadura", "Galicia", "La Rioja", "Madrid", 
    "Murcia", "Navarre", "Valencian Community"
];

// Netherlands (NL)
const netherlandsProvinces = [
    "Drenthe", "Flevoland", "Friesland", "Gelderland", "Groningen", 
    "Limburg", "North Brabant", "North Holland", "Overijssel", 
    "South Holland", "Utrecht", "Zeeland"
];

// Belgium (BE)
const belgianRegions = [
    "Brussels-Capital Region", "Flanders", "Wallonia"
];

// Switzerland (CH)
const swissCantons = [
    "Aargau", "Appenzell Ausserrhoden", "Appenzell Innerrhoden", 
    "Basel-Landschaft", "Basel-Stadt", "Bern", "Fribourg", "Geneva", 
    "Glarus", "Grisons", "Jura", "Lucerne", "Neuchâtel", "Nidwalden", 
    "Obwalden", "Schaffhausen", "Schwyz", "Solothurn", "St. Gallen", 
    "Thurgau", "Ticino", "Uri", "Valais", "Vaud", "Zug", "Zurich"
];

// Austria (AT)
const austrianStates = [
    "Burgenland", "Carinthia", "Lower Austria", "Salzburg", 
    "Styria", "Tyrol", "Upper Austria", "Vienna", "Vorarlberg"
];

// Portugal (PT)
const portugueseRegions = [
    "Açores", "Aveiro", "Beja", "Braga", "Bragança", "Castelo Branco", 
    "Coimbra", "Évora", "Faro", "Guarda", "Leiria", "Lisboa", 
    "Madeira", "Portalegre", "Porto", "Santarém", "Setúbal", 
    "Viana do Castelo", "Vila Real", "Viseu"
];

// Sweden (SE)
const swedishRegions = [
    "Blekinge", "Dalarna", "Gävleborg", "Gotland", "Halland", 
    "Jämtland", "Jönköping", "Kalmar", "Kronoberg", "Norrbotten", 
    "Örebro", "Östergötland", "Skåne", "Södermanland", "Stockholm", 
    "Uppsala", "Värmland", "Västerbotten", "Västernorrland", 
    "Västmanland", "Västra Götaland"
];

// Norway (NO)
const norwegianRegions = [
    "Agder", "Innlandet", "Møre og Romsdal", "Nordland", "Oslo", 
    "Rogaland", "Troms og Finnmark", "Trøndelag", "Vestfold og Telemark", 
    "Vestland", "Viken"
];

// Denmark (DK)
const danishRegions = [
    "Capital Region of Denmark", "Central Denmark Region", 
    "North Denmark Region", "Region of Southern Denmark", 
    "Region Zealand"
];

// Finland (FI)
const finnishRegions = [
    "Åland", "Central Finland", "Central Ostrobothnia", "Kainuu", 
    "Kymenlaakso", "Lapland", "North Karelia", "Northern Ostrobothnia", 
    "Northern Savonia", "Ostrobothnia", "Päijänne Tavastia", 
    "Pirkanmaa", "Satakunta", "South Karelia", "Southern Ostrobothnia", 
    "Southern Savonia", "Southwest Finland", "Tavastia Proper", "Uusimaa"
];

// Poland (PL)
const polishRegions = [
    "Greater Poland", "Kuyavian-Pomeranian", "Lesser Poland", "Łódź", 
    "Lower Silesian", "Lublin", "Lubusz", "Masovian", "Opole", 
    "Podkarpackie", "Podlaskie", "Pomeranian", "Silesian", 
    "Holy Cross", "Warmian-Masurian", "West Pomeranian"
];

// Ireland (IE)
const irishCounties = [
    "Carlow", "Cavan", "Clare", "Cork", "Donegal", "Dublin", 
    "Galway", "Kerry", "Kildare", "Kilkenny", "Laois", "Leitrim", 
    "Limerick", "Longford", "Louth", "Mayo", "Meath", "Monaghan", 
    "Offaly", "Roscommon", "Sligo", "Tipperary", "Waterford", 
    "Westmeath", "Wexford", "Wicklow"
];

// Map of Country Codes to their specific list of regions
const countryRegions: Record<string, string[] | null> = {
    "NG": nigerianStates,
    "US": usStates,
    "CA": canadianProvinces,
    "MX": mexicanStates,
    "DO": dominicanProvinces,
    "CU": cubanProvinces,
    "JM": jamaicanParishes,
    "HT": haitianDepartments,
    "GT": guatemalanDepartments,
    "CR": costaRicanProvinces,
    "PA": panamanianProvinces,
    "HN": honduranDepartments,
    "SV": salvadoranDepartments,
    "NI": nicaraguanDepartments,
    "BZ": belizeanDistricts,
    "BS": bahamianDistricts,
    "TT": trinidadTobagoRegions,
    "BB": barbadianParishes,
    "GB": ukRegions,
    "AU": australianStates,
    "DE": germanStates,
    "FR": frenchRegions,
    "IT": italianRegions,
    "ES": spanishRegions,
    "NL": netherlandsProvinces,
    "BE": belgianRegions,
    "CH": swissCantons,
    "AT": austrianStates,
    "PT": portugueseRegions,
    "SE": swedishRegions,
    "NO": norwegianRegions,
    "DK": danishRegions,
    "FI": finnishRegions,
    "PL": polishRegions,
    "IE": irishCounties,
};

// Countries that will use the dynamic dropdown
const countriesWithDropdown = Object.keys(countryRegions);

// --- Component Interface ---
interface StateRegionSelectProps {
    countryCode: string;
    value: string;
    onChange: (value: string) => void;
    disabled: boolean;
}

// --- Component Implementation ---

export default function StateRegionSelect({ countryCode, value, onChange, disabled }: StateRegionSelectProps) {
    const isCountryWithDropdown = countriesWithDropdown.includes(countryCode);
    const regions = countryRegions[countryCode] || null;

    if (isCountryWithDropdown && regions) {
        // Render a Select component for countries with a predefined list
        return (
            <div className='w-full'>
                <Label className='text-xs mb-1'>State / Region *</Label>
                <Select
                    disabled={disabled}
                    value={value}
                    onValueChange={onChange}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder={`Select state/region for ${countryCode}`} />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px]">
                        {regions.map((region) => (
                            <SelectItem key={region} value={region}>
                                {region}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        );
    }

    // This is the fallback for ALL other countries not explicitly listed above.
    return (
        <div className='w-full'>
            <Label className='text-xs mb-1'>State / Region *</Label>
            <Input
                className='w-full'
                disabled={disabled}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Enter state or region name"
            />
        </div>
    );
}