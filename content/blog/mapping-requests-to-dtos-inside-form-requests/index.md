---
title: Mapping requests to DTOs inside Laravel's form requests
date: '2020-03-02'
description: Let's explore how to map a request to a DTO inside form requests and keep our controllers clean.
featuredImage: featured-image.png
---

[Laravel's form requests](https://laravel.com/docs/6.x/validation#form-request-validation) are custom request classes that contain validation logic. To use them, you just have to type-hint the form request on your controller method and the incoming request will be automatically validated.

Form request example:

```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBlogPost extends FormRequest
{
    public function rules()
    {
        return [
            'title' => [
                'required',
            ],
            'body' => [
                'required',
            ],
        ];
    }
}
```

Form request usage inside controller methods:

```php
<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreBlogPost;

final class BlogPostsController extends Controller
{
    public function store(StoreBlogPost $request)
    {
        // The incoming request is valid...
    }
}
```

The problem is that in our controller method, the IDE can't tell us what data is inside the `$request` variable.

To solve this problem, we can use DTOs. Since native DTOs aren't supported in PHP, we can use [data-transfer-object](https://github.com/spatie/data-transfer-object) by [Spatie](https://spatie.be/) (I'd recommend taking a look at it first, before reading this post), which can be installed by running:

```bash
composer require spatie/data-transfer-object
```

### Our first request DTO

Here's how the DTO for our `StoreBlogPost` request would look:

```php
<?php

declare(strict_types=1);

namespace App\DataTransferObjects;

use Illuminate\Http\Request;
use Spatie\DataTransferObject\DataTransferObject;

final class BlogPostRequestData extends DataTransferObject
{
    public string $title;

    public string $body;

    public static function fromRequest(Request $request): self
    {
        return new self([
            'title' => $request->input('title'),
            'body' => $request->input('body'),
        ]);
    }
}
```

> Notice that we've declared a static constructor `fromRequest`, where we've defined how the request maps to the DTO.

Now inside our controller method, we can instantiate the DTO from the incoming request:

```php
<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreBlogPost;
use App\DataTransferObjects\BlogPostRequestData;

final class BlogPostsController extends Controller
{
    public function store(StoreBlogPost $request)
    {
        $requestData = BlogPostRequestData::fromRequest($request);
    }
}
```

Our IDE now knows that `$requestData` contains `title` and `body`.

### Instantiating the DTO inside form requests

Since form requests are simple classes, we can define helper methods right inside them, for further usage inside our controller methods.

The static constructor `fromRequest` from `BlogPostRequestData`, can be moved to the form request, so we won't have to import and instantiate DTOs in our controllers.

The `formRequest` method can be removed from our DTO:

```php
<?php

declare(strict_types=1);

namespace App\DataTransferObjects;

use Spatie\DataTransferObject\DataTransferObject;

final class BlogPostRequestData extends DataTransferObject
{
    public string $title;

    public string $body;
}
```

And here is how our form request will look now:

```php
<?php

namespace App\Http\Requests;

use App\DataTransferObjects\BlogPostRequestData;
use Illuminate\Foundation\Http\FormRequest;

class StoreBlogPost extends FormRequest
{
    public function rules()
    {
        return [
            'title' => [
                'required',
            ],
            'body' => [
                'required',
            ],
        ];
    }

    public function data()
    {
        return new BlogPostRequestData([
            'title' => $this->input('title'),
            'body' => $this->input('body'),
        ]);
    }
}
```

This way, we can keep our controllers clean and retrieve the mapped request using the `data` method, defined in our form request:

```php
    public function store(StoreBlogPost $request)
    {
        $request->data()->title;
    }
```

---

Thank you very much for reading this post! Subscribe below and get notified when new posts will be released or follow me on [Twitter (@sandulat)](https://twitter.com/sandulat).
