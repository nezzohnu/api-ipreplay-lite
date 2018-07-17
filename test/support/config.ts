import * as chai from 'chai'
import * as chaiSubset from 'chai-subset'
import * as timekeeper from 'timekeeper'
import execGraphql from "./exec_grapql"
import graphqlHandler from "./graphql_handler"
import matchers from "./matchers"
import factory from '../factory'

chai.use(chaiSubset)

global.expect = chai.expect
global.graphqlHandler = graphqlHandler
global.timekeeper = timekeeper
global.execGraphql = execGraphql
global.matchers = matchers
global.factory = factory
