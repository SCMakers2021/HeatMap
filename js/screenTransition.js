// �u�J�e�S���A�C�R���v�{�^������
function searchCategoryClicked( key ){
	var id = "searchCategory" + key;
	console.log("TODO:���� = " + id);
}

function onEntryBtnClicked(){
	var btnVal = $('#btnAmari').val();
	if( "valid" == btnVal ){
		return;
	}
	var isHidden = $('#map_modal').attr('hidden');
	if( 'hidden' == isHidden  ){
		$('#map_modal').attr('hidden',false);
		$('#map_hidden').attr('hidden',false);
	}else{
		$('#map_modal').attr('hidden',true);
	}
}


$(function(){
	function switchAmariMode(flag){
		if( true == flag ){
			$('#btnAmari').attr('src',"image/AmariNegative.png");
			$('#btnAmari').val("invalid");
			console.log("TODO�F�A�}���o�^���[�h��");
		}else{
			$('#btnAmari').attr('src',"image/AmariActive.png");
			$('#btnAmari').val("valid");
		}
	}
	function switchSagasuMode(flag){
		if( true == flag ){
			$('#btnSagasu').attr('src',"image/SagasuNegative.png");
			$('#btnSagasu').val("invalid");
			$('#SagasuSidebar').attr('hidden',false);
			console.log("TODO�F�T�K�X���[�h��");

			$('#map_modal').attr('hidden',true);
			$('#map_hidden').attr('hidden',true);
		}else{
			$('#btnSagasu').attr('src',"image/SagasuActive.png");
			$('#btnSagasu').val("valid");
			$('#SagasuSidebar').attr('hidden',true);
		}
	}

	//--------------------------------------------
	// �n���h���C�x���g����
	//--------------------------------------------
	// �u�T�K�X�v�{�^������
	$('#btnSagasu').click(function(){
		var btnVal = $('#btnSagasu').val();
		if( "valid" == btnVal ){
			switchAmariMode(false);
			switchSagasuMode(true);
		}else{
			switchAmariMode(true);
			switchSagasuMode(false);
		}
	})
	// �u�A�}���v�{�^������
	$('#btnAmari').click(function(){
		var btnVal = $('#btnAmari').val();
		if( "valid" == btnVal ){
			switchAmariMode(true);
			switchSagasuMode(false);
		}else{
			switchAmariMode(false);
			switchSagasuMode(true);
		}
	})
	// �u���[�U�v�{�^������
	$('#btnUser').click(function(){
		console.log("TODO�F���O�C��������");
	})

	// �A�}���u���ցv�{�^������
	$('#amariNext').click(function(){
		console.log("TODO�F�u���ցv������");
	})
	// �A�}���u�L�����Z���v�{�^������
	$('#amariCancel').click(function(){
		$('#map_modal').attr('hidden',true);
		$('#map_hidden').attr('hidden',true);
	})
});