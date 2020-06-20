# Work Plan and Git Flow

## WORK PLAN

* Working hours: 9:00am-6:00pm, Monday-Friday
* Team standup (separate from standup with Lena) around 9am each day
* Mention features you are working on after hours, so there’s less chance of a merge contract
* Trello will be used for its Project Management Board
* Will have features and associated user stories
* Stretch goals can also be included on Trello board
* Group can update Trello board tasks/stories/features/details as needed as project develops
* Assign a task/feature to yourself when it becomes “In Progress” to better track who is working on what
* Assign colors to features to indicate MVP goals/stretch goals
* Meet each day at 5:30pm to have an end-of-day meeting and plan for end-of-day merge

## GIT PROCESS

* Meet each day at 5:30pm to have an end-of-day meeting and plan for end-of-day merge
* Merging at 6:00pm each day (even if some features are incomplete) so that everyone can work with the same code base from development branch
* Merging of other completed features can happen during the day as needed

* Git structure: Master branch that is only changed during the process described below.
* Development branch: All work is done on branches checked out from this Development branch.
* All group members will do work on their own computer with a branch checked out from Development.
* Their branches will have their name (i.e. lulu-branch)
* Idea is to reuse these named branches daily (by updating them by pulling from master or development)
* If another layer is needed, the group can discuss checking out extra branches from their own named branches

* Reviewing PRs: Person who opened the PR cannot approve it
  - PRs to Development and Master branches will require the approval of 1 other person.

*  Merging PRs: Alex will submit the PR, and another group member will need to approve it before it will merge

* Merge process: When we meet at the end of the day, we will merge everything into our Development branch, and then will verify that this branch is operational by deploying Development branch to Heroku
  - Merge to Master branch only if Development branch if fully functional
