import { NextApiRequest, NextApiResponse } from "next";

import { apiCatch, ClientError } from "@/modules/next-backend/api/errors";
import { sendJson } from "@/modules/next-backend/api/helpers";
import { getBackerUnbackProject } from "@/modules/next-backend/logic/getBackerUnbackProject";

/**
 * Given `projectId` and `backerAddress`, returns the corresponding `TxParams$BackerUnbackProject$Response`
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { projectId, backerAddress, legacy, active } = req.query;

    ClientError.assert(
      projectId && typeof projectId === "string",
      "projectId is required"
    );
    ClientError.assert(
      backerAddress && typeof backerAddress === "string",
      "backerAddress is required"
    );
    ClientError.assert(
      !legacy || typeof legacy === "string",
      "legacy must not be a list"
    );
    ClientError.assert(
      !active || (typeof active === "string" && /^(true|false)$/.test(active)),
      "invalid project active status"
    );

    const result = await getBackerUnbackProject(legacy != null, {
      active: active === undefined ? undefined : active === "true",
      backerAddress,
      projectId,
    });
    sendJson(res.status(200), { txParams: result });
  } catch (error) {
    apiCatch(req, res, error);
  }
}
