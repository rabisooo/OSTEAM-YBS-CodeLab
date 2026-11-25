# ER Diagram — Team Events API

```mermaid
erDiagram
    USER ||--o{ EVENT : organizes

    USER {
        int id PK
        string name
        string email UK
    }

    EVENT {
        int id PK
        string title
        datetime date
        boolean done
        int organizerId FK "nullable"
    }
```

## Relationship notes

- One `User` can organize zero or many `Event` records.
- An `Event` can have zero or one organizer (`organizerId` is nullable).
- `User.id` is the primary key; `User.email` is unique.
- `Event.organizerId` is a nullable foreign key referencing `User.id`.
