import storage from "./Storage";
import { observable, action } from "mobx";
import { uniqBy, reject, filter, find, findIndex, sortBy } from "lodash";
import moment from "moment";

export default class contribution {
  constructor() {}
  @observable contributions = [];
  saveKey = {
    key: "contributions",
    data: []
  };
  @action addContribution(Contribution) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Contributions => {
        if (Contributions)
          this.saveKey.data = uniqBy(
            Contributions.concat([Contribution]),
            "id"
          );
        else this.saveKey.data = [Contribution];
        storage.save(this.saveKey).then(() => {
          this.contributions = this.saveKey.data;
          resolve();
        });
      });
    });
  }
  @action removeContribution(ContributionID) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Contributions => {
        this.saveKey.data = reject(Contributions, ["id", ContributionID]);
        storage.save(this.saveKey).then(() => {
          this.contributions = this.saveKey.data;
          resolve();
        });
      });
    });
  }
  @action fetchContributions(EventID) {
    return new Promise((resolve, reject) => {
      if (this.contributions) {
        resolve(
          sortBy(
            filter(this.contributions, {
              event_id: EventID
            }),
            "update_date"
          )
        );
      } else {
        this.readFromStore().then(Contributions => {
          resolve(
            sortBy(
              filter(Contributions, {
                event_id: EventID
              }),
              "update_date"
            )
          );
        });
      }
    });
  }
  updateContributionTitle(NewContribution, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Contributions => {
        let Contribution = find(Contributions, {
          id: NewContribution.id
        });
        let index = findIndex(Contributions, {
          id: NewContribution.id
        });
        Contribution.title = NewContribution.title;
        if (inform) {
          Contribution.title_update = true;
          Contribution.updated = true;
        }
        Contribution.update_date = moment().format("YYYY-MM-DD HH:mm");
        Contributions.splice(index, 1, Contribution);
        this.saveKey.data = sortBy(Contributions, "update_date");
        storage.save(this.saveKey).then(() => {
          this.contributions = this.saveKey;
          resolve();
        });
      });
    });
  }
  @action updateDescription(NewContribution, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Contributions => {
        let Contribution = find(Contributions, {
          id: NewContribution.id
        });
        let index = findIndex(Contributions, {
          id: NewContribution.id
        });
        Contribution.description = NewContribution.description;
        if (inform) {
          Contribution.description_update = true;
          Contribution.updated = true;
        }
        Contribution.update_date = moment().format("YYYY-MM-DD HH:mm");
        Contributions.splice(index, 1, Contribution);
        this.saveKey.data = sortBy(Contributions, "update_date");
        storage.save(this.saveKey).then(() => {
          this.contributions = this.saveKey;
          resolve();
        });
      });
    });
  }

  @action AddContributionMean(ContributionID, NewMean, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Contributions => {
        let Contribution = find(Contributions, {
          id: ContributionID
        });
        let index = findIndex(Contributions, {
          id: ContributionID
        });
        if (Contribution.contribution_mean)
          Contribution.contribution_mean = uniqBy(
            Contribution.contribution_mean.concat([NewMean]),
            "name"
          );
        else Contribution.contribution_mean = [NewMean];
        if (inform) {
          Contribution.added_contribution_mean = true;
          Contribution.updated = true;
        }
        Contribution.update_date = moment().format("YYYY-MM-DD HH:mm");
        Contributions.splice(index, 1, Contribution);
        this.saveKey.data = sortBy(Contributions, "update_date");
        storage.save(this.saveKey).then(() => {
          this.contributions = this.saveKey;
          resolve();
        });
      });
    });
  }

  @action updateContributionMeanCredential(
    ContributionID,
    MeanName,
    newCredential,
    inform
  ) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Contributions => {
        let Contribution = find(Contributions, {
          id: ContributionID
        });
        let index = findIndex(Contributions, {
          id: ContributionID
        });
        let Mean = find(Contribution.contribution_mean, {
          name: MeanName
        });
        let MeanIndex = findIndex(Contribution.contribution_mean, {
          name: MeanName
        });
        Mean.credential = newCredential;
        Contribution.contribution_mean.splice(MeanIndex, 1, Mean);
        if (inform) {
          Contribution.updated_contribution_mean_credential = true;
          Contribution.updated = true;
        }
        Contribution.update_date = moment().format("YYYY-MM-DD HH:mm");
        Contributions.splice(index, 1, Contribution);
        this.saveKey.data = sortBy(Contributions, "update_date");
        storage.save(this.saveKey).then(() => {
          this.contributions = this.saveKey;
          resolve();
        });
      });
    });
  }

  @action updateContributionMeanName(
    ContributionID,
    MeanName,
    NewMeanName,
    inform
  ) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Contributions => {
        let Contribution = find(Contributions, {
          id: ContributionID
        });
        let index = findIndex(Contributions, {
          id: ContributionID
        });
        let Mean = find(Contribution.contribution_mean, {
          name: MeanName
        });
        let MeanIndex = findIndex(Contribution.contribution_mean, {
          name: MeanName
        });
        Mean.name = NewMeanName;
        Contribution.contribution_mean.splice(MeanIndex, 1, Mean);
        if (inform) {
          Contribution.updated_contribution_mean_name = true;
          Contribution.updated = true;
        }
        Contribution.update_date = moment().format("YYYY-MM-DD HH:mm");
        Contributions.splice(index, 1, Contribution);
        this.saveKey.data = sortBy(Contributions, "update_date");
        storage.save(this.saveKey).then(() => {
          this.contributions = this.saveKey;
          resolve();
        });
      });
    });
  }

  @action removeContributionMean(ContributionID, MeanName, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Contributions => {
        let Contribution = find(Contributions, {
          id: ContributionID
        });
        let index = findIndex(Contributions, {
          id: ContributionID
        });
        Contribution.contribution_mean = reject(
          Contribution.contribution_mean,
          ["name", MeanName]
        );
        if (inform) {
          Contribution.removed_contribution_mean = true;
          Contribution.updated = true;
        }
        Contribution.update_date = moment().format("YYYY-MM-DD HH:mm");
        Contributions.splice(index, 1, Contribution);
        this.saveKey.data = sortBy(Contributions, "update_date");
        storage.save(this.saveKey).then(() => {
          this.contributions = this.saveKey;
          resolve();
        });
      });
    });
  }
  @action updateContributionPeriod(NewContribution, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Contributions => {
        let Contribution = find(Contributions, {
          id: NewContribution.id
        });
        let index = findIndex(Contributions, {
          id: NewContribution
        });
        Contribution.period = NewContribution.period;
        if (inform) {
          Contribution.period_updated = true;
          Contribution.updated = true;
        }
        Contribution.update_date = moment().format("YYYY-MM-DD HH:mm");
        Contributions.splice(index, 1, Contribution);
        this.saveKey.data = sortBy(Contributions, "update_date");
        storage.save(this.saveKey).then(() => {
          this.contributions = this.saveKey;
          resolve();
        });
      });
    });
  }
  @action updateContributionAmount(NewContribution, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Contributions => {
        let Contribution = find(Contributions, {
          id: NewContribution.id
        });
        let index = findIndex(Contributions, {
          id: NewContribution
        });
        Contribution.amount = NewContribution.amount;
        if (inform) {
          Contribution.amount_updated = true;
          Contribution.updated = true;
        }
        Contribution.update_date = moment().format("YYYY-MM-DD HH:mm");
        Contributions.splice(index, 1, Contribution);
        this.saveKey.data = sortBy(Contributions, "update_date");
        storage.save(this.saveKey).then(() => {
          this.contributions = this.saveKey;
          resolve();
        });
      });
    });
  }
  @action publishContribution(ContributionID, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Contributions => {
        let Contribution = find(Contributions, {
          id: ContributionID
        });
        let index = findIndex(Contributions, {
          id: ContributionID
        });
        Contribution.published = true;
        if (inform) Contribution.updated = true;
        Contribution.update_date = moment().format("YYYY-MM-DD HH:mm");
        Contributions.splice(index, 1, Contribution);
        this.saveKey.data = sortBy(Contributions, "update_date");
        storage.save(this.saveKey).then(() => {
          this.contributions = this.saveKey;
          resolve();
        });
      });
    });
  }

  @action like(ContributionID, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Contributions => {
        let Contribution = find(Contributions, {
          id: ContributionID
        });
        let index = findIndex(Contributions, {
          id: ContributionID
        });
        Contribution.likes += 1;
        if (inform) {
          Contribution.likes_updated = true;
          Contribution.updated = true;
        }
        Contribution.update_date = moment().format("YYYY-MM-DD HH:mm");
        Contributions.splice(index, 1, Contribution);
        this.saveKey.data = sortBy(Contributions, "update_date");
        storage.save(this.saveKey).then(() => {
          this.contributions = this.saveKey;
          resolve();
        });
      });
    });
  }

  @action unlike(ContributionID) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Contributions => {
        let Contribution = find(Contributions, {
          id: ContributionID
        });
        let index = findIndex(Contributions, {
          id: ContributionID
        });
        Contribution.likes -= 1;
        Contribution.update_date = moment().format("YYYY-MM-DD HH:mm");
        Contributions.splice(index, 1, Contribution);
        this.saveKey.data = sortBy(Contributions, "update_date");
        storage.save(this.saveKey).then(() => {
          this.contributions = this.saveKey;
          resolve();
        });
      });
    });
  }

  @action openContribution(ContributionID, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Contributions => {
        let Contribution = find(Contributions, {
          id: ContributionID
        });
        let index = findIndex(Contributions, {
          id: ContributionID
        });
        Contribution.state = "open";
        if (inform) {
          Contribution.contribution_opened = true;
          Contribution.updated = true;
        }
        Contribution.update_date = moment().format("YYYY-MM-DD HH:mm");
        Contributions.splice(index, 1, Contribution);
        this.saveKey.data = sortBy(Contributions, "update_date");
        storage.save(this.saveKey).then(() => {
          this.contributions = this.saveKey;
          resolve();
        });
      });
    });
  }

  @action closeContribution(ContributionID, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Contributions => {
        let Contribution = find(Contributions, {
          id: ContributionID
        });
        let index = findIndex(Contributions, {
          id: ContributionID
        });
        Contribution.state = "closed";
        if (inform) {
          Contribution.contribution_closed = true;
          Contribution.updated = true;
        }
        Contribution.update_date = moment().format("YYYY-MM-DD HH:mm");
        Contributions.splice(index, 1, Contribution);
        this.saveKey.data = sortBy(Contributions, "update_date");
        storage.save(this.saveKey).then(() => {
          this.contributions = this.saveKey;
          resolve();
        });
      });
    });
  }

  @action addcontributor(ContributionID, NewContributor, inform) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Contributions => {
        let Contribution = find(Contributions, {
          id: ContributionID
        });
        let index = findIndex(Contributions, {
          id: ContributionID
        });
        Contribution.contribtor = Contribution.contribtor.concat([
          NewContributor
        ]);
        if (inform) {
          Contribution.contributor_added = true;
          Contribution.updated = true;
        }
        Contribution.update_date = moment().format("YYYY-MM-DD HH:mm");
        Contributions.splice(index, 1, Contribution);
        this.saveKey.data = sortBy(Contributions, "update_date");
        storage.save(this.saveKey).then(() => {
          this.contributions = this.saveKey;
          resolve();
        });
      });
    });
  }

  @action updateEventContribution(EventID, NewContributions) {
    return new Promise((resolve, reject) => {
      this.readFromStore().then(Contributions => {
        Contributions = reject(Contributions, ["event_id", EventID]);
        Contributions = Contributions.concat(NewContributions);
        this.saveKey.data = sortBy(Contributions, "update_date");
        storage.save(this.saveKey).then(() => {
          this.contributions = this.saveKey;
          resolve();
        });
      });
    });
  }
  readFromStore() {
    return new Promise((resolve, reject) => {
      storage
        .load({
          key: "contributions",
          autoSync: true
        })
        .then(Contributions => {
          resolve(Contributions);
        })
        .catch(error => {
          resolve([]);
        });
    });
  }
}
