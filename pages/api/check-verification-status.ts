import { apiKeyMap, apiMap } from "./verify";
import { ChainId } from "@web3sdks/sdk/evm";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res.status(400).json({ error: "invalid method" });
  }

  const guid = req.query["guid"];
  const chainId = Number(req.query["chainId"]) as ChainId;

  const endpoint = `${apiMap[chainId]}?module=contract&action=checkverifystatus&guid=${guid}&apikey=${apiKeyMap[chainId]}"`;

  try {
    const result = await fetch(endpoint, {
      method: "GET",
    });

    const data = await result.json();
    if (data.status === "1") {
      return res.status(200).json({ result: data.result });
    } else {
      return res.status(200).json({ result: data.result });
    }
  } catch (e) {
    return res.status(400).json({ error: e });
  }
};

export default handler;
