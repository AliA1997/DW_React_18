import React from "react";
import { Link } from "react-router-dom";
import { Button, Header, Icon, Segment } from "semantic-ui-react";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const { t } = useTranslation(['common', 'errors']);
  return (
    <Segment placeholder>
      <Header icon>
        <Icon name="search" />
        {t("not_found", {ns:"errors"})}
      </Header>
      <Segment.Inline>
        <Button as={Link} to="/tickets" primary>
          {t("return", {ns: "common"} )}
        </Button>
      </Segment.Inline>
    </Segment>
  );
}
