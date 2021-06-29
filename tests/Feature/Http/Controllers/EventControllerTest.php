<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\Event;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\EventController
 */
class EventControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    public function test_events_index_returns_events()
    {
        $event = Event::factory(5)->create();

        $response = $this->get(route('events.index'));

        $response
        ->assertOk()
        ->assertJsonStructure([[
            'id',
            'title',
            'from',
            'to',
            'days',
        ]]);
    }

    public function test_events_show_returns_event()
    {
        $event = Event::factory()->create();

        $response = $this->get(route('events.show', $event));

        $response
        ->assertOk()
        ->assertJsonStructure([
            'id',
            'title',
            'from',
            'to',
            'days',
        ]);
    }

    public function test_events_store_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\EventController::class,
            'store',
            \App\Http\Requests\EventStoreRequest::class
        );
    }


    public function test_events_store_saves()
    {
        $title = $this->faker->sentence(4);
        $from = $this->faker->date();
        $to = $this->faker->date();

        $response = $this->post(route('events.store'), [
            'title' => $title,
            'from' => $from,
            'to' => $to,
        ]);

        $events = Event::query()
            ->where('title', $title)
            ->where('from', $from)
            ->where('to', $to)
            ->get();

        $this->assertCount(1, $events);
    }



    public function test_events_update_uses_form_request_validation()
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\EventController::class,
            'update',
            \App\Http\Requests\EventUpdateRequest::class
        );
    }


    public function test_events_update_saves()
    {
        $event = Event::factory()->create();
        $title = $this->faker->sentence(4);
        $from = $this->faker->date();
        $to = $this->faker->date();

        $response = $this->put(route('events.update', $event), [
            'title' => $title,
            'from' => $from,
            'to' => $to,
        ]);

        $events = Event::query()
            ->where('title', $title)
            ->where('from', $from)
            ->where('to', $to)
            ->get();

        $this->assertCount(1, $events);
    }
}
