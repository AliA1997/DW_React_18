import { observer } from "mobx-react-lite";
import React from "react";
import { Container, Divider, Grid, Header, List, Menu, Segment } from "semantic-ui-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default observer(function Footer() {
  const { t } = useTranslation(['common']);
  let currentYear = new Date().getFullYear()
  
  return (
    <Segment className='footer' inverted>
          <Container>
              <Grid columns={2} stackable inverted>
                <Grid.Column className="left-footer-column">
                    <List horizontal inverted divided size='small'>
                    <List.Item>{t("footer.copyright", {ns: "common"})} {currentYear}{" "}
                     {t("footer.bydowellsystems", {ns: "common"})} </List.Item>
                    <List.Item> {t("footer.allrightsreserved", {ns: "common"})}</List.Item>
                    <List.Item> {t("telephone", {ns: "common"})}: (800) 487-0279</List.Item>
                    </List>
                </Grid.Column>
                <Grid.Column className="right-footer-column">
                    <List horizontal inverted divided link size='small'>
                    <List.Item 
                    className="footer-link"
                    as={Link}
                    to="/tickets">
                        {t("home", {ns: "common"})}
                    </List.Item>
                    <List.Item 
                    className="footer-link"
                    as={Link}
                    to="/tickets">
                        {t("feedback", {ns: "common"})}
                    </List.Item>
                    <List.Item 
                    className="footer-link"
                    as={Link}
                    to="/tickets">
                        {t("terms", {ns: "common"}) + " and " + t("conditions", {ns: "common"})}
                    </List.Item>
                    <List.Item 
                    className="footer-link"
                    as={Link}
                    to="/tickets">
                        {t("Privacy", {ns: "common"})}
                    </List.Item>
                    <List.Item 
                    className="footer-link"
                    as={Link}
                    to="/tickets">
                        {t("eula", {ns: "common"})}
                    </List.Item>
                    <List.Item 
                    className="footer-link"
                    as={Link}
                    to="/tickets">
                        {t("rst", {ns: "common"})}
                    </List.Item>
                    </List>
                </Grid.Column>
            </Grid>
          </Container>
        </Segment>
  );
});
