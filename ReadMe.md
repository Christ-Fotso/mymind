Enum role
    superadmin
    admin
    manager
    custumer
    
classe
-user
    uid 
    fisrtname
    lastname
    mail
    role
    uid_enterprise optional

-enterprise
    uid
    Name

-project
    uid
    enterprise_uid
    creator
    name
    description
    status
    users[]

-task
    uid
    project_uid optional
    name
    status
    priority
    deadline time
    users[]

comment
    uid
    content
    user_uid
    task_uid

Notification
    uid
    content
    task_uid
    trigger
    status



