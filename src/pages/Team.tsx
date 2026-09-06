import { useState, useEffect } from "react";
import Navbar from "@/components/ui/Navbar";
import ClubFooter from "@/components/ui/ClubFooter";
import { Card } from "@/components/ui/card";
import clubPhoto from "../assets/club_group_picture.jpg";
import defualtPfp from "../assets/default_pfp.png";
import { FaLinkedin, FaGithub } from "react-icons/fa";

interface TeamMember {
  id?: number;
  name: string;
  position: string;
  pictureUrl: string;
  linkedinUrl: string;
  githubUrl: string;
}

export default function Team() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      const result = await FetchTeamMembers();
      if (result.success) {
        setTeamMembers(result.teamMembers);
      }
      setLoading(false);
    };
    fetchMembers();
  }, []);

  return (
    <div>
      <Navbar />

      <main className="flex-grow mt-25">
        <section>
          {/* Group picture */}
          <div className="flex justify-center px-4 py-2">
            <div className="w-full max-w-6xl">
              <Card className="shadow-md p-2">
                <div className="w-full rounded-md overflow-hidden">
                  <img
                    src={clubPhoto}
                    alt="Group Picture"
                    className="w-full h-auto rounded-md"
                  />
                </div>
              </Card>
            </div>
          </div>

          {/* Team page description */}
          <div className="flex justify-center px-4 py-2">
            <div className="w-full max-w-6xl">
              <h1 className="text-3xl font-bold text-black80">Our Team</h1>
            </div>
          </div>
        </section>

        {/* Dynamic width listing of all club leaders */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-crimson border-r-transparent" />
            <p className="mt-4">Loading team members...</p>
          </div>
        ) : (
          <section className="flex justify-center px-4">
            <div className="w-full max-w-6xl">
              <div className="grid gap-10 grid-cols-[repeat(auto-fit,_minmax(255px,_max-content))] justify-center">
                {teamMembers?.map((member, row) => (
                  <MemberProfile
                    key={member.id || row}
                    name={member.name}
                    position={member.position}
                    pictureUrl={member.pictureUrl}
                    linkedinUrl={member.linkedinUrl}
                    githubUrl={member.githubUrl}
                  />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <ClubFooter />
    </div>
  );
}

function MemberProfile({
  name,
  position,
  pictureUrl,
  linkedinUrl,
  githubUrl,
}: TeamMember) {
  return (
    <Card className="items-center max-w-[255px] gap-0 mb-5 transition-transform duration-150 ease-in-out hover:scale-101 hover:shadow-md">
      <img
        src={pictureUrl || defualtPfp}
        className="w-36 h-36 rounded-full object-cover mb-6"
      />
      <h2 className="font-bold text-2xl text-gray-800">{name}</h2>
      <p className="text-lg text-gray-700">{position}</p>
      <div className="flex gap-3 mt-2">
        {linkedinUrl && (
          <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">
            <FaLinkedin
              size={26}
              className="text-black80 hover:text-crimson transition-colors"
            />
          </a>
        )}
        {githubUrl && (
          <a href={githubUrl} target="_blank" rel="noopener noreferrer">
            <FaGithub
              size={26}
              className="text-black80 hover:text-crimson transition-colors"
            />
          </a>
        )}
      </div>
    </Card>
  );
}

async function FetchTeamMembers() {
  try {
    const res = await fetch("/api/team");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const result = await res.json();

    const formattedData: TeamMember[] = result.map((row: any) => ({
      id: row.member_id,
      name: row.name,
      position: row.position,
      pictureUrl: row.picture_url,
      linkedinUrl: row.linkedin_url,
      githubUrl: row.github_url,
    }));

    return { success: true, teamMembers: formattedData };
  } catch (error) {
    console.error("Error fetching team members:", error);
    return { success: false, teamMembers: [] };
  }
}
