# Vendor Management System

1. Create a new Workflow
   ```json
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
  ```
2. Get the request for a specfic Approver(eg.by Paul-Marsh)
   GET Request : url : localhost:3444/getMyApprovalRequest/Paul-Marsh
   ```json
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
```
3. Approver approves a request
   ```json
   POST Request : url : localhost:3444/approve
   Body : {
   "approver":"Paul-Marsh",
   "\_id": "5f65c10b9716281c2cbfa8b9",
   "id": "5f65bbae411d9230f887fe2d",
   "lvl": 2,
   "index": 0,
   "response":1
   }
   Response : {
   "msg": "sucess"
   }
```
4. Get the Status of the Workflow
   ```json
   GET Request : url : localhost:3444/5f65bbae411d9230f887fe2d
   Response : {
   "\_id": "5f65bbae411d9230f887fe2d",
   "data": [
   {
   "type": "sequential",
   "data": [
   [
   "Elsa-Ingram",
   1,
   ""
   ],
   [
   "Nick-Holden",
   2,
   ""
   ]
   ]
   },
   {
   "type": "any-one",
   "data": [
   [
   "Nick-Holden",
   1,
   ""
   ],
   [
   "John",
   -1,
   ""
   ]
   ]
   },
   {
   "type": "round-robin",
   "data": [
   [
   "Paul-Marsh",
   1,
   ""
   ],
   [
   "D-Joshi",
   1,
   ""
   ],
   [
   "John",
   1,
   ""
   ]
   ]
   }
   ],
   "cur_lvl": 3,
   "cur_status": "Approved"
   }
   ```
