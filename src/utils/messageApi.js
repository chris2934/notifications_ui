import axios from "axios"
import { GET_MESSAGES } from "../graphql/queries"
import { sortMessagesByTimestamp } from "./messageHelpers"
import { transformIncomingMessage } from "./messageTransformer"

export const fetchMessagesFromAPI = async () => {
  const apiKey = import.meta.env.VITE_API_KEY
  const graphqlEndpoint = import.meta.env.VITE_GRAPHQL_ENDPOINT

  const response = await axios.post(
    graphqlEndpoint,
    { query: GET_MESSAGES },
    {
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
    },
  )

  const fetchedMessages = Array.isArray(response?.data?.data?.getMessages)
    ? response.data.data.getMessages
    : []

  return fetchedMessages
    .filter((msg) => msg?.MessageId && msg?.ReceivedAt && msg?.MessageBody)
    .map(transformIncomingMessage)
    .sort(sortMessagesByTimestamp)
}
