import type { NextApiRequest, NextApiResponse } from 'next'
import { Entry } from '../../../utils/types/entry'
import { DB } from '../../../utils/db'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { method } = req

  // This will allow OPTIONS request
  if (method === "OPTIONS") {
    return res.status(200).send("ok")
  }



  try {
    const db = DB.getInstance()
    switch (method) {
      case "GET":
        const { title} = req.query
        const entry = db.get(title as string)
        if (!entry) {
          return res.status(404).send("Not found")
        }
          const auth = req.headers.authorization
          if (!auth) {
            return res.status(401).send("Unauthorized")
          }
          const [type, token] = auth.split(" ")
          if (type !== "pin" || token !== entry.pin) {
            return res.status(401).send("Unauthorized")
          }
        return res.status(200).json(entry)
      case "POST":
        const newEntry: Entry = req.body
        const pin = db.set(newEntry.title, newEntry)
        return res.status(201).json({ pin })
    }} catch (error) {
      console.error(error)
    return res.status(500).send({ error: "Internal server error" })
  }
  res.status(200).json({ name: 'John Doe' })
}


