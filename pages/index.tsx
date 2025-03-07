import { GetServerSideProps } from "next";
import { SWRConfig, unstable_serialize } from "swr";

import PageHome from "../containers/PageHome";

import { try$ } from "@/modules/async-utils";
import { db } from "@/modules/next-backend/db";
import {
  getAllProjects,
  GetAllProjects$Params,
  GetAllProjects$Response,
} from "@/modules/next-backend/logic/getAllProjects";
import { httpGetAllProjects$GetKey } from "@/modules/next-backend-client/api/httpGetAllProjects";

type Props = {
  fallback: Record<string, unknown>;
};

export default function RouteToPageHome({ fallback }: Props) {
  return (
    <SWRConfig value={{ fallback }}>
      <PageHome />
    </SWRConfig>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  _context
) => {
  const featuredProjects$Params: GetAllProjects$Params = {
    category: "featured",
    active: true,
  };
  const featuredProjects$Key = httpGetAllProjects$GetKey(
    featuredProjects$Params
  );
  const featuredProjects$Response: GetAllProjects$Response | undefined =
    await try$(
      async () => await getAllProjects(db, featuredProjects$Params),
      () => undefined
    );

  const sponsoredProjects$Params: GetAllProjects$Params = {
    category: "sponsor",
    active: true,
  };
  const sponsoredProjects$Key = httpGetAllProjects$GetKey(
    sponsoredProjects$Params
  );
  const sponsoredProjects$Response: GetAllProjects$Response | undefined =
    await try$(
      async () => await getAllProjects(db, sponsoredProjects$Params),
      () => undefined
    );

  return {
    props: {
      fallback: {
        [unstable_serialize(featuredProjects$Key)]: featuredProjects$Response,
        [unstable_serialize(sponsoredProjects$Key)]: sponsoredProjects$Response,
      },
    },
  };
};
