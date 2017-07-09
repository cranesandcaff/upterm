/* tslint:disable:no-unused-variable */
import * as React from "react";
import * as css from "./css/main";
import {fontAwesome} from "./css/FontAwesome";
import {watchManager} from "../plugins/GitWatcher";
import {Session} from "../shell/Session";
import {Status} from "../Enums";
import * as _ from "lodash";
import {PromptComponent} from "./PromptComponent";

const VcsDataComponent = ({data}: { data: VcsData }) => {
    if (data.kind === "repository") {
        return (
            <div style={css.statusBar.vcsData}>
                <span style={css.statusBar.status(data.status)}>
                    <span style={css.statusBar.icon}>{fontAwesome.codeFork}</span>
                    {data.branch}
                </span>
            </div>
    );
    } else {
        return <div></div>;
    }
};

interface Props {
    session: Session;
}

export class StatusBarComponent extends React.Component<Props, {}> {
    promptComponent: PromptComponent;

    render() {
        const lastJob = _.last(this.props.session.jobs);
        const lastJobInProgress = lastJob && lastJob.status === Status.InProgress;

        if (lastJob) {
            lastJob.once("end", () => this.forceUpdate());
        }

        const promptComponent = lastJobInProgress ? undefined : <PromptComponent
            key={this.props.session.jobs.length}
            ref={component => { this.promptComponent = component!; }}
            session={this.props.session}
            isFocused={true}
        />;

        return (
            <div className="status-bar" style={css.statusBar.itself}>
                {promptComponent}
                <span style={css.statusBar.rightSizeWrapper}>
                    <span style={css.statusBar.icon}>{fontAwesome.folderOpen}</span>
                    <span className="present-directory" style={css.statusBar.presentDirectory}>{this.props.session.directory}</span>
                    <VcsDataComponent data={watchManager.vcsDataFor(this.props.session.directory)}/>
                </span>
            </div>
        );
    }
}
