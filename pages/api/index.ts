import { makeSchema, objectType, stringArg, asNexusMethod } from '@nexus/schema'
import { GraphQLDate } from 'graphql-iso-date'
import { PrismaClient } from '@prisma/client'
import { ApolloServer } from 'apollo-server-micro'
import path from 'path'

export const GQLDate = asNexusMethod(GraphQLDate, 'date')

const prisma = new PrismaClient()

const User = objectType({
  name: 'User',
  definition(t) {
    t.int('id')
    t.string('name')
    t.string('email')
    t.list.field('posts', {
      type: 'Post',
      resolve: parent =>
        prisma.user
          .findOne({
            where: { id: Number(parent.id) },
          })
          .posts(),
    })
  },
})

const Post = objectType({
  name: 'Post',
  definition(t) {
    t.int('id')
    t.string('title')
    t.string('content', {
      nullable: true,
    })
    t.boolean('published')
    t.field('author', {
      type: 'User',
      nullable: true,
      resolve: parent =>
        prisma.post
          .findOne({
            where: { id: Number(parent.id) },
          })
          .author(),
    })
  },
})


const Hospital = objectType({
  name: 'Hospital',
  definition(t) {
    t.int('id')
    t.string('name')
    t.field('user', {
      type: 'User',
      nullable: true,
      resolve: parent =>
        prisma.hospital
          .findOne({
            where: { id: Number(parent.id) },
          })
          .user(),
    })
  },
})




const Query = objectType({
  name: 'Query',
  definition(t) {
    t.field('post', {
      type: 'Post',
      args: {
        postId: stringArg({ nullable: false }),
      },
      resolve: (_, args) => {
        return prisma.post.findOne({
          where: { id: Number(args.postId) },
        })
      },
    })
    t.field('getHospitalByID', {
      type: 'Hospital',
      args: {
        hospitalId: stringArg({ nullable: false }),
      },
      resolve: (_, args) => {
        return prisma.hospital.findOne({
          where: { id: Number(args.hospitalId) },
        })
      },
    })

    // t.field('hospital', {
    //   type: 'Hospital',
    //   args: {
    //     name: stringArg({ nullable: false }),
    //   },
    //   resolve: (_, args) => {
    //     return prisma.post.findOne({
    //       where: { id: Number(args.postId) },
    //     })
    //   },
    // })


    t.list.field('getHospitals', {
      type: 'Hospital',
      resolve: (_parent, _args, ctx) => {
        return prisma.hospital.findMany({

        })
      },
    })

    t.list.field('feed', {
      type: 'Post',
      resolve: (_parent, _args, ctx) => {
        return prisma.post.findMany({
          where: { published: true },
        })
      },
    })

    t.list.field('drafts', {
      type: 'Post',
      resolve: (_parent, _args, ctx) => {
        return prisma.post.findMany({
          where: { published: false },
        })
      },
    })



    t.list.field('filterPosts', {
      type: 'Post',
      args: {
        searchString: stringArg({ nullable: true }),
      },
      resolve: (_, { searchString }, ctx) => {
        return prisma.post.findMany({
          where: {
            OR: [
              { title: { contains: searchString } },
              { content: { contains: searchString } },
            ],
          },
        })
      },
    })
  },
})

const Mutation = objectType({
  name: 'Mutation',
  definition(t) {
    t.field('signupUser', {
      type: 'User',
      args: {
        name: stringArg(),
        email: stringArg({ nullable: false }),
      },
      resolve: (_, { name, email }, ctx) => {
        return prisma.user.create({
          data: {
            name,
            email,
          },
        })
      },
    })

    t.field('deletePost', {
      type: 'Post',
      nullable: true,
      args: {
        postId: stringArg(),
      },
      resolve: (_, { postId }, ctx) => {
        return prisma.post.delete({
          where: { id: Number(postId) },
        })
      },
    })

    t.field('deleteHospital', {
      type: 'Hospital',
      nullable: true,
      args: {
        hospitalId: stringArg({ nullable: false }),
      },
      resolve: (_, { hospitalId }, ctx) => {
        return prisma.hospital.delete({
          where: { id: Number(hospitalId) },
        })
      },
    })

    t.field('createDraft', {
      type: 'Post',
      args: {
        title: stringArg({ nullable: false }),
        content: stringArg(),
        authorEmail: stringArg(),
      },
      resolve: (_, { title, content, authorEmail }, ctx) => {
        return prisma.post.create({
          data: {
            title,
            content,
            published: false,
            author: {
              connect: { email: authorEmail },
            },
          },
        })
      },
    })

    t.field('createHospital', {
      type: 'Hospital',
      args: {
        name: stringArg({ nullable: false }),
        userEmail: stringArg(),

      },
      resolve: (_, { name, userEmail }, ctx) => {
        return prisma.hospital.create({
          data: {
            name,
            user: {
              connect: { email: userEmail },
            },
          },
        })
      },
    })

    t.field('publish', {
      type: 'Post',
      nullable: true,
      args: {
        postId: stringArg(),
      },
      resolve: (_, { postId }, ctx) => {
        return prisma.post.update({
          where: { id: Number(postId) },
          data: { published: true },
        })
      },
    })

    t.field('updateHospital', {
      type: 'Hospital',
      nullable: true,
      args: {
        hospitalId: stringArg(),
        name: stringArg({ nullable: false }),
        userEmail: stringArg(),


      },
      resolve: (_, { hospitalId, name, userEmail }, ctx) => {
        return prisma.hospital.update({
          where: { id: Number(hospitalId,) },
          data: {
            name,
            user: {
              connect: { email: userEmail },
            },
          },
        })
      },
    })

  },
})

export const schema = makeSchema({
  types: [Query, Mutation, Post, User, GQLDate, Hospital],
  outputs: {
    typegen: path.join(process.cwd(), 'pages', 'api', 'nexus-typegen.ts'),
    schema: path.join(process.cwd(), 'pages', 'api', 'schema.graphql')
  },
})

export const config = {
  api: {
    bodyParser: false,
  },
};

export default new ApolloServer({ schema }).createHandler({
  path: '/api',
});