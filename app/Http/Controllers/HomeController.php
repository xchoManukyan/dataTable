<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    /**
     * @param $request
     * @return mixed
     */
    protected function usersPaginate($request)
    {
        $q = User::orderBy('id', 'desc')->with(['token', 'currency']);

        if ($request['search']){
            $q->where('name', 'like', '%'.$request['search'].'%');
        }
        if ($request['currency']){
            $q->where('name', '=', $request['currency']);
        }

        $page = $request['page'] && is_numeric($request['page'])? $request['page']: 1;
        $per_page = $request['per_page'] && is_numeric($request['per_page'])? $request['per_page']: 10;

        return $q->paginate($per_page, '*', '', $page);
    }

    /**
     * @param Request $request
     * @return Application|Factory|View|JsonResponse
     */
    public function index(Request $request)
    {
        return view('home.index', ['users' => $this->usersPaginate($request)]);
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function paginate(Request $request): JsonResponse
    {
        return response()->json($this->usersPaginate($request), 200);
    }
}
