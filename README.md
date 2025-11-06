# Next.js Frontend Test (Paid, ~2h)

**Goal:** Build `/contacts` using the provided mock API.

## Requirements
- List contacts from `GET /api/contacts`
- Edit in a modal (name/email/role) via `PUT /api/contacts/:id`
- Delete inline via `DELETE /api/contacts/:id`
- Small custom hook to manage data: `{ data, loading, error, reload, update, remove }`
- Loading / empty / error states
- Clean, typed code, reusable `ContactItem`

## Nice-to-have (optional)
- Optimistic updates with rollback
- Minimal a11y (labels, focus trap OK if time)
- Simple search by name/email

## Run
```bash
npm i
npm run dev
# open http://localhost:3000/contacts
