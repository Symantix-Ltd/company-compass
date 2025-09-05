import Link from "next/link";

interface Officer {
  title: string;
  appointment_count: number;
  date_of_birth?: {
    month?: number;
    year?: number;
  };
  links: {
    self: string; // e.g. "/officers/Fkg8sBJCwt9MQ4mA9sDy2u8yyGw/appointments"
  };
  address_snippet?: string;
  address?: {
    premises?: string;
    address_line_1?: string;
    locality?: string;
    country?: string;
    postal_code?: string;
  };
}

// Safe slugify function
function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function OfficerCard({ officer }: { officer: Officer }) {
  const officerId = officer.links.self.split("/")[2];
  const slugName = slugify(officer.title);

  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white mb-4 hover:shadow-md transition">
      <h2 className="text-xl font-semibold text-blue-800 mb-2">
        <Link href={`/person/${officerId}/${slugName}`}>
          {officer.title}
        </Link>
      </h2>

      <p className="text-sm text-gray-700 mb-1">
        <strong>Appointments:</strong> {officer.appointment_count}
      </p>

      {officer.date_of_birth?.month && officer.date_of_birth?.year && (
        <p className="text-sm text-gray-700 mb-1">
          <strong>Date of Birth:</strong> {officer.date_of_birth.month}/
          {officer.date_of_birth.year}
        </p>
      )}

      {officer.address_snippet && (
        <p className="text-sm text-gray-700">
          <strong>Address:</strong> {officer.address_snippet}
        </p>
      )}
    </div>
  );
}
