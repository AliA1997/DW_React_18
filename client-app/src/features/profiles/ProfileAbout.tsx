import React, {useState} from 'react';
import {useStore} from "../../app/stores/store";
import {Button, Grid, Header, Tab} from "semantic-ui-react";
import ProfileEditForm from "./ProfileEditForm";
import { observer } from 'mobx-react-lite';
import { useTranslation } from "react-i18next";

export default observer(function ProfileAbout() {
    const {profileStore} = useStore();
    const {isCurrentUser, profile} = profileStore;
    const [editMode, setEditMode] = useState(false);
    const { t } = useTranslation(['common', 'profile']);

    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width='16'>
                    <Header floated='left' icon='user' content={t("about", {ns:"common"}) + ` ${profile?.firstName}`} />
                    {isCurrentUser && (
                        <Button
                            floated='right'
                            basic
                            content={editMode ? t("cancel", {ns:"common"}) : t("edit", {ns:"profile"}) }
                            onClick={() => setEditMode(!editMode)}
                        />
                    )}
                </Grid.Column>
                <Grid.Column width='16'>
                    {editMode ? <ProfileEditForm setEditMode={setEditMode} /> : <span style={{whiteSpace: 'pre-wrap'}}>{profile?.title}</span>}

                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
})
