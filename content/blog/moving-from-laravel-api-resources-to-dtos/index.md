---
title: Moving from Laravel API resources to DTOs
date: '2020-02-26'
description: You'll discover how the default Laravel API resources can be replaced with Data Transfer Objects using Spatie's package and a few adjustments.
featuredImage: featured-image.png
emoji: 🧬
---

[Laravel's API resources](https://laravel.com/docs/master/eloquent-resources) are a transformation layer that sits between your Eloquent models and the JSON responses returned by your API. This approach is completely fine, however the use case of these resources is quite limited to API responses only, they aren't type hinted and lack autocompletion.

API resources can be replaced with DTOs. Since native DTOs aren't supported in PHP, we can use [data-transfer-object](https://github.com/spatie/data-transfer-object) by [Spatie](https://spatie.be/) (I'd recommend taking a look at it first, before reading this post), which can be installed by running:

```bash
composer require spatie/data-transfer-object
```

### Our First Data Transfer Object

```php
<?php

declare(strict_types=1);

namespace App\DataTransferObjects;

use App\Models\User;
use Spatie\DataTransferObject\DataTransferObject;

final class UserData extends DataTransferObject
{
    public int $id;

    public string $name;

    public string $email;

    public static function fromModel(User $user): self
    {
        return new self([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
        ]);
    }
}
```

Notice that we've defined a static constructor `fromModel`, which receives a type hinted `User` model. This way we have maximum flexibility to construct the DTO, inject relationships and so on.

Now we can instantiate `UserData`:

```php
$user = User::first();

UserData::fromModel($user);
```

### Returning the DTO as a Response

Unfortunately, `UserData` can't be returned by API endpoints, since Laravel doesn't know how to serialize it.

To achieve this, we can implement the `Illuminate\Contracts\Support\Responsable` interface. It would be nice to have whole thing reusable, so we can define `ResponseData`, which will implement the `Responsable` interface and wrap other DTOs.

> Keep in mind, that we still want to wrap our DTOs in a `data` key, just like Laravel's resources do.

```php
<?php

declare(strict_types=1);

namespace App\DataTransferObjects;

use Illuminate\Contracts\Support\Responsable;
use Spatie\DataTransferObject\DataTransferObject;

class ResponseData extends DataTransferObject implements Responsable
{
    public int $status = 200;

    /** @var \Spatie\DataTransferObject\DataTransferObject|\Spatie\DataTransferObject\DataTransferObjectCollection */
    public $data;

    /**
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse|\Symfony\Component\HttpFoundation\Response
     */
    public function toResponse($request)
    {
        return response()->json(
            [
                'data' => $this->data->toArray(),
            ],
            $this->status
        );
    }
}
```

We've defined 2 attributes:

- `status` - response status (default **_200_**).
- `data` - payload, which can be either a **_DataTransferObject_** or **_DataTransferObjectCollection_**.

Since we've implemented the `Responsable` interface, we have to define the `toResponse` method, where we can return a JSON response.

> Notice the `$this->data->toArray()` part? Both `DataTransferObject` and `DataTransferObjectCollection` expose the `toArray` method.

Now inside controller methods, we can return the DTO as a response like that:

```php
$user = User::first();

return new ResponseData([
    'data' => UserData::fromModel($user),
]);
```

And we'll get:

```json
{
  "data": {
    "id": 1,
    "name": "John",
    "email": "john@example.org"
  }
}
```

### Returning Paginated Collection Responses

The same way we've defined `ResponseData`, we can define `ResponsePaginationData`:

```php
<?php

declare(strict_types=1);

namespace App\DataTransferObjects;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Contracts\Support\Responsable;
use Spatie\DataTransferObject\DataTransferObject;
use Spatie\DataTransferObject\DataTransferObjectCollection;

class ResponsePaginationData extends DataTransferObject implements Responsable
{
    public LengthAwarePaginator $paginator;

    public DataTransferObjectCollection $collection;

    public int $status = 200;

    /**
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse|\Symfony\Component\HttpFoundation\Response
     */
    public function toResponse($request)
    {
        return response()->json(
            [
                'data' => $this->collection->toArray(),
                'meta' => [
                    'currentPage' => $this->paginator->currentPage(),
                    'lastPage' => $this->paginator->lastPage(),
                    'path' => $this->paginator->path(),
                    'perPage' => $this->paginator->perPage(),
                    'total' => $this->paginator->total(),
                ],
            ],
            $this->status
        );
    }
}
```

Here, we've defined 3 attributes:

- `status` - response status (default **_200_**).
- `paginator` - Laravel's paginator.
- `collection` - our collection.

Usage in controller methods:

```php
$users = User::paginate(30);

return new ResponsePaginationData([
    'paginator' => $users,
    'collection' => new UserCollection($users->items()),
]);
```

Output:

```json
{
  "data": [
    {
      "id": 1,
      "name": "John",
      "email": "john@example.org"
    },
    {
      "id": 2,
      "name": "Mike",
      "email": "mike@example.org"
    }
  ],
  "meta": {
    "currentPage": 1,
    "lastPage": 1,
    "path": "http://localhost/api/users",
    "perPage": 30,
    "total": 2
  }
}
```

### Automating Collection Data Mapping

If you've decided to instantiate your DTOs with static constructors, like the `fromModel` example above, you won't be able to instantiate your collections with the default constructor. Instead, we need to define a static constructor in collections as well:

```php
<?php

declare(strict_types=1);

namespace App\DataTransferObjects;

use Spatie\DataTransferObject\DataTransferObjectCollection;

class UserCollection extends DataTransferObjectCollection
{
    public static function create(array $data): UserCollection
    {
        $collection = [];

        foreach ($data as $item)
        {
            $collection[] = UserData::fromModel($item);
        }

        return new self($collection);
    }
}
```

To avoid the definition of such static constructors in each collection, we can create a custom `ModelCollection` class:

```php
<?php

declare(strict_types=1);

namespace App\DataTransferObjects;

use Spatie\DataTransferObject\DataTransferObjectCollection;

class ModelCollection extends DataTransferObjectCollection
{
    public static function create(array $data)
    {
        $collection = [];

        foreach ($data as $item)
        {
            $collection[] = static::mapItem($item);
        }

        return new static($collection);
    }

    public static function mapItem($item)
    {
        return $item;
    }
}
```

Now `UserCollection` will extend `ModelCollection`:

```php
<?php

declare(strict_types=1);

namespace App\DataTransferObjects\Collections;

use App\DataTransferObjects\ModelCollection;
use App\DataTransferObjects\UserData;

final class UserCollection extends ModelCollection
{
    public static function mapItem($item): UserData
    {
        return UserData::fromModel($item);
    }
}
```

So here's how the controller method will look in the end:

```php
$users = User::paginate(30);

return new ResponsePaginationData([
    'paginator' => $users,
    'collection' => UserCollection::create($users->items()),
]);
```

---

Hey, thank you for reading this post entirely! Hopefully it was helpful for you. If you've enjoyed this post, subscribe below and get notified when new articles will be released.
