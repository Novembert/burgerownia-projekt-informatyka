$(document).ready(function () {

    $('.delete_food').on('click', (e) => {
        $target = $(e.target)
        const id = $target.attr('data-id')
        $.ajax({
            type: 'DELETE',
            url: '' + id,
            success: function () {
                window.location.href = "/products"
            },
            error: function (err) {
                console.log(err)
            }
        })
    })

    $('.delete_drink').on('click', (e) => {
        $target = $(e.target)
        const id = $target.attr('data-id')
        $.ajax({
            type: 'DELETE',
            url: '' + id,
            success: function () {
                window.location.href = "/products"
            },
            error: function (err) {
                console.log(err)
            }
        })
    })

    document.querySelectorAll('#delete_order').forEach(element => {
        element.addEventListener('click', (e) => {
            $target = $(e.target)
            const id = $target.attr('data-id')
            $.ajax({
                type: 'DELETE',
                url: '/orders/' + id,
                success: function () {
                    window.location.reload('true')
                },
                error: function (err) {
                    console.log(err)
                }
            })
        })
    })

    $('#edit_btn').on('click', () => {
        $('#edit_form').toggleClass('active')
    })

    $('#addFoodBtn').on('click', () => {
        $('#addFoodForm').toggleClass('active')
    })

    $('#addDrinkBtn').on('click', () => {
        $('#addDrinkForm').toggleClass('active')
    })

    $('#edit_form').on('submit', (e) => {
        e.preventDefault()
        $.ajax({
            type: 'PATCH',
            dataType: 'json', // data type
            data: $("#edit_form").serialize(), // post data || get data
            url: '',
            success: function () {
                window.location.reload('true')
            },
            error: function (err) {
                console.log(err)
            }
        })
    })

    document.querySelectorAll('#add_order_form div').forEach(element => {
        document.addEventListener('click', () => {
            if (element.childNodes[1].checked) {
                element.childNodes[5].classList = "active item_counter"
                if (element.childNodes[5].value < 1) {
                    element.childNodes[5].value = 1;
                }
            }
            else {
                element.childNodes[5].classList = "item_counter"
                element.childNodes[5].value = null;
            }
        })
    })

    $('#generateRaportButton').on('click', () => {
        window.open('/raport/download')
    })
})