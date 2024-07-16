import { observer } from 'mobx-react-lite';
import React from 'react';
import { Tab } from 'semantic-ui-react';
import { Profile } from '../../app/models/profile';
import { useStore } from '../../app/stores/store';
import ProfileAbout from './ProfileAbout';
import ProfileTickets from './ProfileTickets';
import ProfileFollowings from './ProfileFollowings';
import ProfilePhotos from './ProfilePhotos';
import { useTranslation } from "react-i18next";

interface Props {
    profile: Profile;
}

export default observer(function ProfileContent({profile}: Props) {
    const {profileStore} = useStore();
    const { t } = useTranslation(['common', 'profile']);


    const panes = [
        {menuItem: t("about", {ns:"common"}), render: () => <ProfileAbout />},
        {menuItem: t("photos", {ns:"common"}), render: () => <ProfilePhotos profile={profile} />},
        {menuItem: t("tickets", {ns:"common"}), render: () => <ProfileTickets />},
        {menuItem: t("openspot", {ns:"common"}), render: () => <ProfileFollowings />},
        {menuItem: t("openspot", {ns:"common"}), render: () => <ProfileFollowings />},
    ];

    return (
        <Tab 
            menu={{fluid: true, vertical: true}}
            menuPosition='right'
            panes={panes}
            onTabChange={(e, data) => profileStore.setActiveTab(data.activeIndex)}
        />
    )
})