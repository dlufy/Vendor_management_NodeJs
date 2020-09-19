# Vendor Management System
this system lets you create an approval worflow for things like onboarding a new vendor or payment to the vendor etc. containing various configurable approval levels. 
this solution allow users to configure the workflow and save it into Database. For each action taken by an individual user at all levels logged into the
Database. Finally, we will have a result of approval workflow as Active, Terminated or Executed.

The approval workflow has mainly four components: Users, Approval Actions, Type of Approvals and Approval Levels.

## Definition of final results:
Active: Workflow is active and somebody is required to approve at any level
Terminated: Workflow was terminated as one of the approvers has Rejected the approval
Executed: All users have approved

## List of Users who can be the part of approval matrix
1. Elsa Ingram
2. Paul Marsh
3. D Joshi
4. Nick Holden
5. John

## Approval Actions:
1. Approve: This action will be marked as approved and the workflow will be active so that
the next person in the approval workflow can take the approval actions.
2. Reject: This action will be marked as rejected and the workflow will be terminated.
3. Reject & Remove from workflow: This action will be marked as rejected but will be active
so that the next person in the approval workflow can take the approval actions.

## Type of Approvals
1. Sequential: In this type of approval, all users have to take the approval action in
sequential order as configured. E.g. If Elsa Ingram and Nick Holden have been added
as approvers for Sequential, it is required to first get the action taken by Elsa Ingram and
then Nick Holden will have the option to take approval action.
2. Round-robin: In this type of approval, all users have to take the approval action in any
order as configured. E.g. If Elsa Ingram and Nick Holden have been added as
approvers for Round-robin, it is required to get the action taken by Elsa Ingram and Nick
Holden.
3. Any one: In this type of approval, any user can take the approval action in any order as
configured. E.g. If Elsa Ingram and Nick Holden have been added as approvers for Any
one, it is required to get the action taken by Elsa Ingram or Nick Holden.

## Approval Levels:
We can add n number of levels having any type of approvals. Each level can
be executed accordingly. For example see below how levels and approvers are added and what
type of action can be taken

## Technologies to be used: POSTMAN, Node.js, MongoDB

## Getting Started
```
 git clone
npm install
npm start
```

## APIs to manage the system 
1. Create a new Workflow
```
   structure of API request : {
   "data" :[
   {"type":'name of approval technique in lowercase seperated by hyphen eg. "any-one"',"data":[list of approvers in the format of ['name in camelcase seperated by hyphen',-1,""]]},
   ]
   }
   
   eg. ```json
   POST Request : url:localhost:3444/createWorkFlow
   Body : {
   "data":[
   {"type":"sequential","data":[["Elsa-Ingram",-1,""],["Nick-Holden",-1,""]]},
   {"type":"any-one","data":[["Nick-Holden",-1,""],["John",-1,""]]},
   {"type":"round-robin","data":[["Paul-Marsh",-1,""],["D-Joshi",-1,""],["John",-1,""]]}
   ]
   }

   Response : {
   "msg": "sucess",
   "workflowID": "5f65bbae411d9230f887fe2d"
   }
 
2. Get the request for a specfic Approver(eg.by Paul-Marsh)
   ```json
   GET Request : url : localhost:3444/getMyApprovalRequest/Paul-Marsh
   Response : [
   {
   "_id": "5f65b929fa92e21d8866dff3",
   "id": "5f65b8dbfa92e21d8866dff0",
   "lvl": 1,
   "index": 0,
   "response": 1
   },
   {
   "_id": "5f65c10b9716281c2cbfa8b9",
   "id": "5f65bbae411d9230f887fe2d",
   "lvl": 2,
   "index": 0
   }
   ]
3. Approver approves a request
   ```json
   POST Request : url : localhost:3444/approve
   Body : {
   "approver":"Paul-Marsh",
   "_id": "5f65c10b9716281c2cbfa8b9",
   "id": "5f65bbae411d9230f887fe2d",
   "lvl": 2,
   "index": 0,
   "response":1
   }
   Response : {
   "msg": "sucess"
   }

4. Get the Status of the Workflow
   ```json
   GET Request : url : localhost:3444/5f65bbae411d9230f887fe2d
   Response : {
   "_id": "5f65bbae411d9230f887fe2d",
   "data": [
   {
   "type": "sequential",
   "data": [["Elsa-Ingram",1,""],["Nick-Holden",2,""]]
   },
   {
   "type": "any-one",
   "data": [["Nick-Holden",1,""],["John",-1,""]]
   },
   {
   "type": "round-robin",
   "data": [["Paul-Marsh",1,""],["D-Joshi",1,""],["John",1,""]]
   }
   ],
   "cur_lvl": 3,
   "cur_status": "Approved"
   }
