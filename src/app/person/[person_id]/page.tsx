
import { redirect } from 'next/navigation';


type Params = {
    person_id: string;
  };

export default async function PersonPage({ params }: { params: Promise<Params> }) {


  redirect(`/`);
}
