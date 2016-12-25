( function( $, mw, pf ) {
	$(".simpleupload_btn").each(function(){
		_this = $(this);
		input = _this.parent().find('#' + _this.data('id'));
		input.hide();
		if (input.val() != '') {
			_this.val("Change Image");
			$('<img src="'+ mw.config.get('wgArticlePath').replace('$1', 'Special:Redirect/file/' + input.val() + '?width=100') +'">').insertAfter(input);
			_this.parent().find('.simpleupload_rmv_btn').show();
		}
	});

	$(".simpleupload_rmv_btn").click(function () {
		_this = $(this);
		input = _this.parent().find('#' + _this.data('id'));
		_this.parent().find('img').remove();
		input.val('');
		_this.hide();
		_this.parent().find('.simpleupload_btn').val("Upload Image");
	});

	$(".simpleupload_btn").click(function () {
		$(this).parent().find("input[type='file']").trigger('click');
	});

	$("input[type='file'].simpleupload").change(function(event) {
		_this = $(this);
		input = _this.parent().find('#' + _this.data('id'));
		var fileToUpload = event.target.files[0]; // get (first) File 
		var fileName = event.target.files[0].name;

		formdata = new FormData(); //see https://developer.mozilla.org/en-US/docs/Web/Guide/Using_FormData_Objects?redirectlocale=en-US&redirectslug=Web%2FAPI%2FFormData%2FUsing_FormData_Objects
		formdata.append("action", "upload");
		formdata.append("format", "json");
		formdata.append("filename", fileName);
		formdata.append("token", mw.user.tokens.get( 'editToken' ) );
		formdata.append("file", fileToUpload);

		_this.parent().find('.simpleupload_btn').val("Uploading...");
		//as we now have created the data to send, we send it...
		$.ajax( { //http://stackoverflow.com/questions/6974684/how-to-send-formdata-objects-with-ajax-requests-in-jquery
			url: mw.util.wikiScript( 'api' ), //url to api.php 
			contentType:false,
			processData:false,
			type:'POST',
			data: formdata,//the formdata object we created above
			success:function(data){
				//do what you like, console logs are just for demonstration :-)
				if (!data.error) {
					input.val(fileName);
					input.parent().find('img').remove();
					$('<img src="'+ mw.config.get('wgArticlePath').replace('$1', 'Special:Redirect/file/' + fileName + '?width=100') +'">').insertAfter(input);
					_this.parent().find('.simpleupload_btn').val("Change Image");
					_this.parent().find('.simpleupload_rmv_btn').show();
				} else {
					alert("Error: " + data.error.info);
					_this.parent().find('.simpleupload_btn').val("Upload Image");
				}
			},
			error:function(xhr,status, error){
				alert('Something went wrong! Please check the log for errors');
				_this.parent().find('.simpleupload_btn').val("Upload Image");
				console.log(error)
			}
		});
	});
}( jQuery, mediaWiki, pf ) );
