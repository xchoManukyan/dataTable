@extends('layouts.home')
@section('content')
<h1 class="mb-5">Data table</h1>
<div id="table-container"></div>

@stop
@section('JS')
{{--    <script src="/js/app.js"></script>--}}
    <script src="/js/components/dataTable.js"></script>
    <script type="module">
    // import DataTable from "../../../js/components/dataTable.js";

    let mainData = {!! json_encode($users) !!};
    let options = {
        container: '#table-container',
        autoload: true,
        color: 'red',
        uri: 'http://127.0.0.1:8000/paginate',
        tableAttrs: ['class="table table-striped table-hover"'],
        thAttrs: ['scope="col"']
    }
    let query = {
        page: 1,
        per_page: 10
    }
    let functions = {
        currencyFormat: function (item){
            let formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: item.currency.code,
            });
            return formatter.format(item.amount);
        }
    }
    let content = [
        {
            title: 'id',
            value: 'id',
            attrs: ['class="bg-dark text-warning"']
        },
        {
            title: 'name',
            value: 'name'
        },
        {
            title: 'email',
            value: 'email'
        },
        {
            title: 'phone',
            value: 'phone'
        },
        {
            title: 'address',
            value: '`<small>${item.address}</small>`'
        },
        {
            title: 'amount',
            value: 'this.functions.currencyFormat(item)',
            code: true
        },
        {
            title: 'currency',
            value: 'currency.title'
        },
        {
            title: 'token',
            value: 'token.value'
        },
        {
            title: 'registered',
            value: 'item.created_at.split("T")[0]',
            code: true,
        },
        {
            title: 'actions',
            value: '`<div class="d-flex">' +
                        '<button type="button" data-id="${item.id}" class="btn btn-outline-info edit-user" style="margin-right: 10px"><i class="fas fa-pencil-alt"></i></button>' +
                        '<button type="button" data-id="${item.id}" class="btn btn-outline-danger delete-user"><i class="fas fa-pencil-alt"></i></button>' +
                    '</div>`'
        }
    ]
    let dataTable = new DataTable(options, content, query, {}, functions);

    // setTimeout(function(){ dataTable.query.search = 'tetx' }, 3000);

    /*jQuery*/
    $('#table-container').on('click', '.edit-user', function(){
        alert('edit id: '+$(this).attr('data-id'))
    })
    $('#table-container').on('click', '.delete-user', function(){
        alert('delete id: '+$(this).attr('data-id'))
    })
</script>
@stop
