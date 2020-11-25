import Layout from '../../components/Layout'
import Router, { useRouter } from 'next/router'
import { withApollo } from '../../apollo/client'
import gql from 'graphql-tag'
import { useQuery, useMutation } from '@apollo/react-hooks'

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

function HospitalByID() {
  const hospitalId = useRouter().query.id
  const { loading, error, data } = useQuery(getHospitalByID, {
    variables: { hospitalId },
  })

  const [publish] = useMutation(PublishMutation)
  const [deletePost] = useMutation(DeleteMutation)

  if (loading) {
    console.log('loading')
    return <div>Loading ...</div>
  }
  if (error) {
    console.log('error')
    return <div>Error: {error.message}</div>
  }

  console.log(`response`, data)

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
        {(
          <button
            onClick={async e => {
              await publish({
                variables: {
                  hospitalId,
                },
              })
              Router.push('/')
            }}>
            Edit
          </button>
        )}
        <button
          onClick={async e => {
            await deletePost({
              variables: {
                hospitalId,
              },
            })
            Router.push('/')
          }}>
          Delete
        </button>
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
      `}</style>
    </Layout>
  )
}

export default withApollo(HospitalByID)
