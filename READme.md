# CSV Uploader


## 🚀 Installing CSV Uploader

To install CSV Uploader please follow this steps: 

If using npm
```
npm install
```

## Using CSV Uploader

To use CSV Uploader, please follow the next steps:

```
npm run dev
```

## How to use

User should upload a csv file and be able to see all data and search through it

## Routes:

## Sending data (POST): /api/files 

The user will upload a CSV file containing data with the structure below

```
name,city,country,favorite_sport
John Doe,New York,USA,Basketball
Jane Smith,London,UK,Football
Mike Johnson,Paris,France,Tennis
Karen Lee,Tokyo,Japan,Swimming
Tom Brown,Sydney,Australia,Running
Emma Wilson,Berlin,Germany,Basketball
```

### POST Route: http://localhost:3000/api/files

## Returning data (GET):

### GET Route to get all data stored: http://localhost:3000/api/data

### Response: 

All data stored will be shown

```
[
    {
        "id": 1,
        "name": "John Doe",
        "city": "New York",
        "country": "USA",
        "favorite_sport": "Basketball"
    },
    {
        "id": 2,
        "name": "Jane Smith",
        "city": "London",
        "country": "UK",
        "favorite_sport": "Football"
    },
    ...
]

```

### GET Route to search terms through every column of the CSV: http://localhost:3000/api/users

### Response: 

When receiving a query parameter, this route will search through previously uploaded data

### Query exemple 

http://localhost:3000/api/users?q=jane

`?q=jane` refers to input from user

### Result 

```
[
    {
        "id": 2,
        "name": "Jane Smith",
        "city": "London",
        "country": "UK",
        "favorite_sport": "Football"
    }
]
```

## Developed by

- [Leticia Martins](https://github.com/letxns)


<!-- ## 📝 Licença

Esse projeto está sob licença. Veja o arquivo [LICENÇA](LICENSE.md) para mais detalhes. -->