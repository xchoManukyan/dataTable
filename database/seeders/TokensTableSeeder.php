<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Faker\Generator as Faker;
class TokensTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @param Faker $faker
     * @return void
     */
    public function run(Faker $faker)
    {
        $users = User::All();

        foreach ($users as $user){
            $user->token()->create(['value' => $faker->macAddress]);
        }
    }
}
