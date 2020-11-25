import Layout from "../components/Layout"
import Link from "next/link"
import { withApollo } from "../apollo/client"
import gql from "graphql-tag"
import { useQuery } from "@apollo/react-hooks"

const DraftsQuery = gql`
query DraftsQuery {
drafts {
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
const hospitalsQuery = gql`
query {
  getHospitals {
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

const Hospital = ({ hospital }) => (
  <Link href="/h/[id]" as={`/h/${hospital.id}`}>
    <a>
      <h2>{hospital.name}</h2>
      <small>By {hospital.user ? hospital.user.name : "Unknown User"}</small>
      <p>{hospital.id}</p>
      <style jsx>{`
        a {
          text-decoration: none;
          color: inherit;
          padding: 2rem;
          display: block;
        }
      `}</style>
    </a>
  </Link>
)

const hospitals = () => {
  const { loading, error, data } = useQuery(hospitalsQuery)

  if (loading) {
    return <div>Loading ...</div>
  }
  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <Layout>
      <div className="page">
        <h1>Hospitals</h1>
        <main>
          {data.getHospitals.map((hospital) => (
            <div key={hospital.id} className="hospital">
              <Hospital hospital={hospital} />
            </div>
          ))}
        </main>
      </div>
      <style jsx>{`
        .hospital {
          background: white;
          transition: box-shadow 0.1s ease-in;
        }

        .hospital:hover {
          box-shadow: 1px 1px 3px #aaa;
        }

        .hospital + .hospital {
          margin-top: 2rem;
        }
      `}</style>
    </Layout>
  )
}

export default withApollo(hospitals)
