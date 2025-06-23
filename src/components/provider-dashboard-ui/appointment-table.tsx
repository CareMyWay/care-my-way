type Appointment = { id: number; client: string; date: string; time: string };

export default function AppointmentsTable({ appointments }: { appointments: Appointment[] }) {
  if (appointments.length === 0) {
    return <p className="text-medium-green">No upcoming appointments.</p>;
  }
  return (
    <table className="w-full text-left">
      <thead>
        <tr>
          <th className="pb-2">Client</th>
          <th className="pb-2">Date</th>
          <th className="pb-2">Time</th>
        </tr>
      </thead>
      <tbody>
        {appointments.map((appt) => (
          <tr key={appt.id} className="border-t border-lightest-green">
            <td className="py-2">{appt.client}</td>
            <td className="py-2">{appt.date}</td>
            <td className="py-2">{appt.time}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}