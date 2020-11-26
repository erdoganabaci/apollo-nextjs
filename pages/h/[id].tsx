import Layout from '../../components/Layout'
import Router, { useRouter } from 'next/router'
import { withApollo } from '../../apollo/client'
import gql from 'graphql-tag'
import { useQuery, useMutation } from '@apollo/react-hooks'
import React, { useState } from "react"
import { type } from 'os'

const PostQuery = gql`
  query PostQuery($postId: String!) {
    post(postId: $postId) {
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

const getHospitalByID = gql`
query($hospitalId: String!) {
  getHospitalByID(hospitalId: $hospitalId) {
    id
    name
    user {
      id
      name
      email
    }
  }
}

`

const PublishMutation = gql`
  mutation PublishMutation($postId: String!) {
    publish(postId: $postId) {
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
const updateHospital = gql`
  mutation($hospitalId: String , $name:String! , $userEmail:String ){
    updateHospital(hospitalId: $hospitalId , name:$name , userEmail:$userEmail){
      id
      name
      user{
        id
        name
        email
      }
    }
  }
`

const DeleteMutation = gql`
  mutation DeleteMutation($postId: String!) {
    deletePost(postId: $postId) {
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
const deleteHospitalMutation = gql`
mutation($hospitalId: String!){
  deleteHospital(hospitalId: $hospitalId ){
    id
    name
  }
}

`


function HospitalByID() {
  const [name, setName] = useState("")
  const [userEmail, setUserEmail] = useState("")

  const hospitalId = useRouter().query.id
  const { loading, error, data } = useQuery(getHospitalByID, {
    variables: { hospitalId },
  })
  const [publish] = useMutation(PublishMutation)
  const [update] = useMutation(updateHospital)
  const [deleteHospital] = useMutation(deleteHospitalMutation)

  // const [deletePost] = useMutation(DeleteMutation)

  if (loading) {
    console.log('loading')
    return <div>Loading ...</div>
  }
  if (error) {
    console.log('error')
    return <div>Error: {error.message}</div>
  }

  console.log(`response`, name)

  let title = data.getHospitalByID.name
  // if (!data.post.published) {
  //   title = `${title} (Draft)`
  // }
  title = `${title} (*)`


  const userName = data.getHospitalByID.name ? data.getHospitalByID.user.name : 'Unknown author'
  return (
    <Layout>
      <div>
        <h2>{title}</h2>
        <p>By {userName}</p>
        <p>{data.getHospitalByID.id}</p>
        <div>
          <form
            onSubmit={async (e) => {
              e.preventDefault()

              await update({
                variables: {
                  hospitalId,
                  name,
                  userEmail,
                },
              })
              Router.push("/hospitals")
            }}
          >
            {/* <h1>Edit Hospital</h1> */}
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
              value="Update"
            />



            <a className="back" href="#" onClick={() => Router.push("/hospitals")}>
              or Cancel
          </a>
          </form>
          <button className="back" onClick={async e => {
            console.log(typeof (hospitalId))
            await deleteHospital({
              variables: {
                hospitalId,
              },
            })
            Router.push('/')
          }}
          >
            Delete
          </button>
        </div>


      </div>
      <style jsx>{`
        .page {
          background: white;
          padding: 2rem;
        }

        .actions {
          margin-top: 2rem;
        }

        button {
          background: #ececec;
          border: 0;
          border-radius: 0.125rem;
          padding: 1rem 2rem;

        }

        button + button {
          margin-left: 1rem;
        }

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
          margin-bottom:10px;
        }

        .back {
          margin-left: 1rem;
        }
      `}</style>
    </Layout>
  )
}

export default withApollo(HospitalByID)
