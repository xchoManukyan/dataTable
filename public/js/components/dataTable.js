class DataTable {

    constructor(options = {}, content = [], query = {}, pagination = {}, functions = {}) {
        this.setValues('options', options);
        this.setValues('query', query);
        this.setValues('functions', functions);
        this.setValues('pagination', pagination);
        this.content = content;
        this.setStyles();
        this.render(true);
        this.watch();
        if(this.options.autoload) this.request();
    }

    content = []

    pagination = {
        total: null,
        last_page: null,
        per_page: 10,
        current_page: 1,
        data: []
    }

    query = {
        per_page: 10,
        page: 1
    }

    oldQuery = null;

    functions = {}

    options = {
        container: '',
        autoload: false,
        ajax: false,
        color: '#039BE5',
        fullWidth: true,
        paginationDirection: 'end',
        noDataMessage: 'no data',
        tableAttrs: [],
        theadAttrs: [],
        thAttrs: [],
        tdAttrs: [],
        trAttrs: [],
        tbodyAttrs: []
    }

    setValues(variable, values){
        Object.entries(values).forEach(entry => {
            const [key, value] = entry;
            this[variable][key] = value;
        });
    }

    setStyles(){
        let css = `
            /*box*/
            ${this.options.container} .dt-box{
                position: relative;
                min-height: 500px;
                display: inline-block;
                ${this.options.fullWidth? 'width: 100%': ''}
            }
            /*loader*/
            ${this.options.container} .dt-loader{
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(255, 255, 255, 0.5)
                }
            ${this.options.container} .dt-loader>div{
                    position: relative;
                    height: 100%;
                }
            ${this.options.container} .dt-loader>div>div{
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                }
            ${this.options.container} .dt-loader>div>div>div{
                    color: ${this.options.color}; display: inline-block;
                    width: 2rem;
                    height: 2rem;
                    vertical-align: text-bottom;
                    border: .15em solid currentColor;
                    border-right-color: transparent;
                    border-radius: 50%;
                    -webkit-animation: .75s linear infinite spinner-border;
                    animation: .75s linear infinite spinner-border;
                }
            /*pagination*/
            ${this.options.container} .td-pagination{
                    display: flex;
                    padding: 0;
                    margin: 0;
                    list-style: none;
                    align-items: center;
                    justify-content: ${this.getPaginationDirection()}
                }
            ${this.options.container} .td-pagination>li>a{
                    color: black;
                    float: left;
                    padding: 8px 16px;
                    text-decoration: none;
                    cursor: pointer;
                }
            ${this.options.container} .td-pagination>li>a:hover{
                    background-color:${this.options.color};
                    color: white;
                    transition: .5s
                }
            ${this.options.container} .td-pagination>li>.active{
                    background-color:${this.options.color};
                    color: white;
                    cursor:default;
                }
            `;
        let style = document.createElement('style');

        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }

        document.getElementsByTagName('head')[0].appendChild(style);
    }

    setEventListeners(){

        document.querySelectorAll('.dt-page').forEach(item => {
            item.addEventListener('click', event => {

                let val = event.target.getAttribute('data-value');
                document.querySelector(this.options.container+' .active').classList.remove("active");
                event.target.classList.add('active');
                if (isNaN(Number(val))){
                    if (val === 'prev' && Number(this.pagination.current_page) > 1){
                        this.query.page = Number(this.pagination.current_page)- 1;
                    }else if (val === 'next' && Number(this.pagination.current_page) < Number(this.pagination.last_page)){
                        this.query.page = Number(this.pagination.current_page) + 1;
                    }
                }else {
                    this.query.page = val;
                }
            })
        })
    }

    getAttrs(attrs){
        return attrs? attrs.join(' '): '';
    }

    getPaginationDirection(){

        switch(this.options.paginationDirection) {
            case "end":
                return 'flex-end'
            case "center":
                return 'center'
            case "start":
                return 'flex-start'
            default:
                return 'flex-end'
        }
    }

    findValue(item, value){
        let val = value.split('.')
        let result = item;
        val.forEach(valItem => {
            result = result[valItem]
        })
        return result;
    }

    loader(val = true){
        if (val){
            let box = document.querySelector(`${this.options.container}>.dt-box`);
            let spinner = `<div class="dt-loader"><div><div><div></div></div></div></div>`;
            box.innerHTML = box.innerHTML + spinner
        }else{
            let spinner = document.querySelector( `${this.options.container}>.dt-box>.dt-loader` );
            spinner.parentNode.removeChild( spinner );
        }
    }

    renderHead(){

        let html = ``;
        this.content.forEach(item => {
            html += `<th ${this.getAttrs(this.options.thAttrs)} ${this.getAttrs(item.thAttrs)}>${item.title}</th>`;
        })

        return `<thead ${this.getAttrs(this.options.theadAttrs)}>
                    <tr ${this.getAttrs(this.options.trAttrs)}>${ html }</tr>
                </thead>`
    }

    renderPagination(){
        let result = ``;
        if (this.pagination.total && this.pagination.last_page && Number(this.pagination.last_page) > 1){
            let html = ``;

            if (Number(this.pagination.current_page) > 1){
                html += `<li><a class="dt-page" data-value="prev">«</a></li>`
            }

            if (Number(this.pagination.last_page) > 10){

                let k = Number(this.pagination.current_page);

                for (let i = 1; i < 4; i++) {
                    if (Number(this.pagination.current_page) + i < Number(this.pagination.last_page)){
                        k++
                    }
                    if (Number(this.pagination.current_page) - i <= 0){
                        k++
                    }
                }

                if (Number(this.pagination.current_page) > 4){
                    html += `<li><a class="dt-page" data-value="1">1</a></li>`
                }

                if (k-7 > 1){
                    html += `<li><span style="padding: 0 10px">...</span></li>`
                }

                for (let i=k-7; i<k; i++) {
                    html += `<li><a class="${Number(this.pagination.current_page) === i+1?'active':'dt-page'}" data-value="${i+1}">${i+1}</a></li>`
                }

                if (Number(this.pagination.last_page) - k > 1){
                    html += `<li><span style="padding: 0 10px">...</span></li>`
                }

                if (Number(this.pagination.last_page) > Number(this.pagination.current_page)){
                    html += `<li><a class="dt-page" data-value="${this.pagination.last_page}">${this.pagination.last_page}</a></li>`
                }

            }else{
                for (let i = 0; i < Number(this.pagination.last_page); i++) {
                    html += `<li><a class="${Number(this.pagination.current_page) === i+1?'active':'dt-page'}" data-value="${i+1}">${i+1}</a></li>`
                }
            }

            if (Number(this.pagination.current_page) < Number(this.pagination.last_page)){
                html += `<li><a class="dt-page" data-value="next">»</a></li>`
            }
            result = `<ul class="td-pagination">${html}</ul>`;
        }
        return result;

    }

    renderValue(item, value, code){
        return /<\/?[a-z][\s\S]*>/i.test(value) || code? eval(value): this.findValue(item, value);
    }

    renderRow(item){
        let html = ``;
        this.content.forEach(contentItem => {
            html += `<td ${this.getAttrs(this.options.tdAttrs)} ${this.getAttrs(contentItem.attrs)}>${this.renderValue(item, contentItem.value, contentItem.code)}</td>`;
        })
        return html;
    }

    renderBody(firstRun){

        let html = ``;
        if (this.pagination.data.length){
            this.pagination.data.forEach(item => {
                html += `<tr ${this.getAttrs(this.options.trAttrs)}>${ this.renderRow(item) }</tr>`;
            })
        }else if (!firstRun){
            html = `<tr><td colspan="${this.content.length}"><div style="height: 400px; display: flex; justify-content: center; align-items: center"><span>${this.options.noDataMessage}</span></div></td></tr>`
        }
        return `<tbody ${this.getAttrs(this.options.tbodyAttrs)}>${ html }</tbody>`
    }

    render(firstRun = false){
        let el = document.querySelector(this.options.container);

        el.innerHTML = `
            <div class="dt-box">
                <table ${this.getAttrs(this.options.tableAttrs)}>
                    ${ this.renderHead() }
                    ${ this.renderBody(firstRun) }
                </table>
                <div>${ this.renderPagination() }</div>
            </div>
            `
        this.setEventListeners();
    }

    requestAjax(){
        let self = this;
        jQuery.ajax({
            type:'GET',
            url:this.options.uri,
            data: this.query,
            success: function(response) {
                self.pagination = response;
                setTimeout(function(){ self.render(); }, 300);
            }
        });
    }

    requestFetch(){
        let self = this;
        let url = new URL(this.options.uri);
        Object.keys(this.query).forEach(key => url.searchParams.append(key, this.query[key]))
        fetch(url)
            .then(r =>  r.json().then(data => ({status: r.status, body: data})))
            .then(response => {
                self.pagination = response.body;
                setTimeout(function(){ self.render(); }, 300);
            });
    }

    request(){
        this.loader();
        this.options.ajax? this.requestAjax(): this.requestFetch();
    }

    watchQuery(){
        if (this.oldQuery){
            Object.entries(this.query).forEach(entry => {
                const [key] = entry;
                if (this.oldQuery[key] !== this.query[key]) this.request();
            });
        }
        this.oldQuery = {... this.query}
    }

    watch(){
        setInterval(() => {
            this.watchQuery();
        }, 10);
    }
}
