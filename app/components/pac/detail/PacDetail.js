import template from './pacDetail.html';
import './pacDetail.styl';
import '../pac.styl';

class PacDetail {
  /*@ngInject*/
  constructor($routeParams, PacService){
    this.name = 'pacDetail';
    this.template = template;
    this.restrict = 'E';
    this.scope = {};
    this.$routeParams = $routeParams;
    this.PacService = PacService;
  }

  /*@ngInject*/
  controller($scope, $routeParams, PacService){
    console.log('pac detail');
    $scope.pacId = $routeParams.pacId;

    var startDate = new Date(2010, 1, 1).getTime();
    var endDate = new Date(2014, 9, 1).getTime();

    $scope.defaults = {
      photo: "images/icons/genderless.svg"
    }
    $scope.photo = $scope.defaults.photo;

    $scope.viewModel = {
      pac: {},
      financialSummary: null,
      moneyByState: null,
      fundingExpenditures: null
    };

    PacService.getPac($scope.pacId).then(function(result) {

      $scope.viewModel.pac = result;
      $scope.photo = ($scope.viewModel.pac.photo || $scope.defaults.photo);

      // Pac.getPacFinancialSummary($scope.viewModel.pac.filer_id).then(function(result) {
      //   $scope.viewModel.financialSummary = result;
      // });

      // CampaignService.getCampaignMoneyByState($scope.viewModel.campaign.filer_id).then(function(result) {
      //   $scope.viewModel.moneyByState = result;
      // });

      // var theFunction = CampaignService.getFundingExpenditures;
      // CampaignService.getFundingExpenditures($scope.viewModel.campaign.filer_id).then(function(result) {
      //   $scope.viewModel.fundingExpenditures = result;
      // });

    });
  }

}

export default PacDetail;
