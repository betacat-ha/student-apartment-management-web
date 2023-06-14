interface Building {
    id: number;
    name: string;
    apartments: Apartment[];
}

interface Apartment {
    id: number;
    buildingId: number;
    name: string;
    students: any;
}


const getBuildingFromApartmentId = (apartmentId: number, data: Building[]): Building | undefined => {
    for (const building of data) {
        for (const apartment of building.apartments) {
            if (apartment.id === apartmentId) {
                return building;
            }
        }
    }
};

export default getBuildingFromApartmentId;