import React, { useState } from "react"
import Layout from "../components/Layout"
import Router from "next/router"
import { withApollo } from "../apollo/client"
import gql from "graphql-tag"
import { useMutation } from "@apollo/react-hooks"

const CreateDraftMutation = gql`
  mutation CreateDraftMutation(
    $title: String!
    $content: String
    $authorEmail: String!
  ) {
    createDraft(title: $title, content: $content, authorEmail: $authorEmail) {
      id
      title
      content
      published
      author {
        id
        name
      }
    }
  }
`

const createHospitalMutation = gql`
mutation($name: String!, $userEmail: String) {
  createHospital(name: $name, userEmail: $userEmail) {
    id
    name
    user {
      id
      name
    }
  }
}

`



function Hospital(props) {
    const [name, setName] = useState("")
    const [userEmail, setUserEmail] = useState("")

    const [createHospital, { loading, error, data }] = useMutation(
        createHospitalMutation
    )

    return (
        <Layout>
            <div>
                <form
                    onSubmit={async (e) => {
                        e.preventDefault()

                        await createHospital({
                            variables: {
                                name,
                                userEmail,
                            },
                        })
                        Router.push("/hospitals")
                    }}
                >
                    <h1>Create Hospital</h1>
                    <input
                        autoFocus
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Hospital Name"
                        type="text"
                        value={name}
                    />
                    <input
                        onChange={(e) => setUserEmail(e.target.value)}
                        placeholder="User (email adress)"
                        type="text"
                        value={userEmail}
                    />
                    {/* <textarea
                        cols={50}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Content"
                        rows={8}
                        value={content}
                    /> */}
                    <input
                        disabled={!name || !userEmail}
                        type="submit"
                        value="Create"
                    />
                    <a className="back" href="#" onClick={() => Router.push("/hospitals")}>
                        or Cancel
          </a>
                </form>
            </div>
            <style jsx>{`
        .page {
          background: white;
          padding: 3rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        input[type="text"],
        textarea {
          width: 100%;
          padding: 0.5rem;
          margin: 0.5rem 0;
          border-radius: 0.25rem;
          border: 0.125rem solid rgba(0, 0, 0, 0.2);
        }

        input[type="submit"] {
          background: #ececec;
          border: 0;
          padding: 1rem 2rem;
        }

        .back {
          margin-left: 1rem;
        }
      `}</style>
        </Layout>
    )
}

export default withApollo(Hospital)
