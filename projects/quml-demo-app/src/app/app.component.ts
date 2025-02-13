import { Component, OnInit } from '@angular/core';
import { samplePlayerConfig } from './quml-library-data';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  contentId = 'do_214234702021410816111';
  // contentId = 'do_214248762435878912148';
  playerConfig: any;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.getQuestionSet(this.contentId).subscribe(res => {
      this.initializePlayer(res);
    });
  }

  initializePlayer(metadata) {
    let qumlConfigMetadata: any = localStorage.getItem(`config_${this.contentId}`) || '{}';
    let config;
    if (qumlConfigMetadata) {
      qumlConfigMetadata = JSON.parse(qumlConfigMetadata);
      config = { ...samplePlayerConfig.config, ...qumlConfigMetadata };
    }
    this.playerConfig = {
      context: samplePlayerConfig.context,
      config: config ? config : samplePlayerConfig.config,
      metadata,
      data: {}
    };
  }

  getPlayerEvents(event) {
    console.log('get player events', JSON.stringify(event));

    // Store the metaData locally
    if (event.eid === 'END') {
      let qumlMetaDataConfig = event.metaData;
      localStorage.setItem(`config_${this.contentId}`, JSON.stringify(qumlMetaDataConfig));
      this.playerConfig.config = { ...samplePlayerConfig.config, ...qumlMetaDataConfig };;
    }
  }

  getTelemetryEvents(event) {
    console.log('event is for telemetry', JSON.stringify(event));
  }
}
