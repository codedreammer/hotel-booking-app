import { getAvailabilityData } from "./action";
import Calendar from "./Calender";

export default async function AvailabilityPage() {
    const data = await getAvailabilityData(14);
    
    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-4">Availability</h1>
            <Calendar data={data} />
        </div>
    );
}
